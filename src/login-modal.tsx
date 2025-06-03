import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import css from "./login-modal.css"; // esto será un string
import { useForm } from "antd/es/form/Form";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

export interface StylesForLoginModalProps {
    primaryColor?: string,
    secondaryColor?: string,
}
export interface LoginModalProps {
    title: string,
    visible: boolean,
    doingLogin: boolean,
    onLogin: (username: string, password: string) => void,
    onForgetPassword: () => void,
    haveError: boolean,
    availableLanguages: string[],
    defaultLanguage: string,
    styles: StylesForLoginModalProps,
    urlToRegister?: string,

}
class LoginModalElement extends HTMLElement {
    private mountPoint: HTMLDivElement;
    private root: ReactDOM.Root | null = null;
    private styleElement: HTMLStyleElement;
    private props: Partial<LoginModalProps> = {};
    static get observedAttributes() {
        return [
            "title",
            "visible",
            "doing-login",
            "primary-color",
            "secondary-color",
            "default-language",
            "available-languages",
            "url-to-register",
            "have-error"
        ];
    }
    constructor() {
        super();
        this.mountPoint = document.createElement("div");
        const shadow = this.attachShadow({ mode: "open" });

        // 👉 Crear un <style> con el contenido del CSS y añadirlo al shadowRoot
        this.styleElement = document.createElement("style");
        this.styleElement.textContent = css;
        document.head.appendChild(this.styleElement);
        shadow.appendChild(this.mountPoint);
        this.updateColors({});
    }
    setLanguage(lang: string) {
        i18n.changeLanguage(lang).then(() => {
            this.renderReactComponent();
        });
    }
    connectedCallback() {
        if (!this.root) {
            this.root = ReactDOM.createRoot(this.mountPoint);
        }
        this.props = {
            title: this.getAttribute("title") || "",
            visible: this.getAttribute("visible") === "true",
            doingLogin: this.getAttribute("doing-login") === "true",
            defaultLanguage: this.getAttribute("default-language") || "es",
            styles: {
                primaryColor: this.getAttribute("primary-color") || "#1890ff",
                secondaryColor: this.getAttribute("secondary-color") || "#40a9ff"
            },
            availableLanguages: this.parseAvailableLanguages(this.getAttribute("available-languages")),
            urlToRegister: this.getAttribute("url-to-register") || "",
            haveError: this.getAttribute("have-error") === "true",
            onLogin: (user, pass) => this.dispatchEvent(new CustomEvent("login", { detail: { user, pass } })),
            onForgetPassword: () => this.dispatchEvent(new CustomEvent("forget-password"))
        };

        this.renderReactComponent();
    }
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;

        switch (name) {
            case "title":
                this.props.title = newValue || "";
                break;
            case "visible":
                this.props.visible = newValue === "true";
                break;
            case "doing-login":
                this.props.doingLogin = newValue === "true";
                break;
            case "primary-color":
            case "secondary-color":
                this.props.styles = {
                    ...this.props.styles,
                    [name === "primary-color" ? "primaryColor" : "secondaryColor"]: newValue || ""
                };
                break;
            case "default-language":
                this.props.defaultLanguage = newValue || "es";
                break;
            case "available-languages":
                this.props.availableLanguages = this.parseAvailableLanguages(newValue);
                break;
            case "url-to-register":
                this.props.urlToRegister = newValue || "";
                break;
            case "have-error":
                this.props.haveError = newValue === "true";
                break;
        }
        this.updateColors({});
        this.renderReactComponent();
    }
    setProps(newProps: Partial<LoginModalProps>) {
        this.props = { ...this.props, ...newProps };
        this.updateColors(this.props.styles || {});
        this.renderReactComponent();
    }
    private parseAvailableLanguages(value: string | null): string[] {
        if (!value) return ["es"];
        try {
            return JSON.parse(value);
        } catch {
            return value.split(",").map(v => v.trim()).filter(Boolean);
        }
    }
    private updateColors = (styles: StylesForLoginModalProps) => {
        this.styleElement.textContent = `
    :root {
      --primary-client-color-login-modal: ${styles.primaryColor || '#1890ff'};
      --secondary-client-color-login-modal: ${styles.secondaryColor || '#40a9ff'};
    }
    ${css}
  `;
    };
    private renderReactComponent() {
        if (!this.root) return;
        this.root.render(<LoginModal {...(this.props as LoginModalProps)} />);
    }
}

customElements.define("login-modal", LoginModalElement);

export default function LoginModal({
    title,
    visible,
    onLogin,
    onForgetPassword,
    haveError,
    defaultLanguage,
    doingLogin,
    urlToRegister,
    availableLanguages }: LoginModalProps) {
    const [form] = useForm();
    const onFinish = (): void => {
        onLogin(form.getFieldValue("username"), form.getFieldValue("password"));
    }
    const [visibleState, setVisibleState] = useState(visible);
    const IsLaguagePresentInUrl = (): boolean => availableLanguages.some(language => window.location.pathname.split("/").length > 0 && window.location.pathname.split("/")[1] == language)
    const GetLanguageInUrl = (): string => IsLaguagePresentInUrl() ? `/${window.location.pathname.split("/")[1]}` : '';
    const GetDefaultLanguage = (): string => defaultLanguage;
    const getFormattedUrl = (path: string): string => `${(IsLaguagePresentInUrl() ? GetLanguageInUrl() : GetDefaultLanguage())}/${path}`;
    const { t } = useTranslation();
    return (
        <Modal onCancel={() => setVisibleState(false)} className="" title={title} open={visibleState} footer={null}>
            <div className="login-form">
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label={t("usernamePlaceholder") || "Username"}
                        name="username"
                        rules={[{ required: true, message: t("requiredFieldError") || "Error" }]}
                    >
                        <Input className="app-input" />
                    </Form.Item>

                    <Form.Item
                        label={t("passwordPlaceholder") || "Password"}
                        name="password"
                        rules={[{ required: true, message: t("requiredFieldError") || "Error" }]}
                    >
                        <Input.Password className="app-input" />
                    </Form.Item>
                    <div className="reminder-password-link">
                        <span className="app-colored-main-font app-link" onClick={onForgetPassword}>{t("reminderPasswordLink") || "Forgot your password?"}</span>
                    </div>

                    {
                        haveError ?
                            <div className="error-message">
                                {t("formErrorMessage") || "There was an error with your login. Please try again."}
                            </div>
                            :
                            ''
                    }

                    <Button size="large" className="app-button btn-submit" htmlType="submit">
                        {doingLogin ? <LoadingOutlined /> : ''}{t("accessTextButton") || "Access"}
                    </Button>



                </Form>
                <div className="not-register">
                    <a className="app-colored-main-font app-link" href={`${urlToRegister ?? getFormattedUrl('register')}`}>{t("notRegisterText") || "I'm not registered"}</a>
                </div>
            </div>
        </Modal>
    );
}