import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";
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
    onCancel: () => void,
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
        this.renderReactComponent();
    }

    setProps(newProps: Partial<LoginModalProps>) {
        this.props = { ...this.props, ...newProps };
        this.updateColors(this.props.styles || {});
        this.renderReactComponent();
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
    onCancel,
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
    const IsLaguagePresentInUrl = (): boolean => availableLanguages.some(language => window.location.pathname.split("/").length > 0 && window.location.pathname.split("/")[1] == language)
    const GetLanguageInUrl = (): string => IsLaguagePresentInUrl() ? `/${window.location.pathname.split("/")[1]}` : '';
    const GetDefaultLanguage = (): string => defaultLanguage;
    const getFormattedUrl = (path: string): string => `${(IsLaguagePresentInUrl() ? GetLanguageInUrl() : GetDefaultLanguage())}/${path}`;
    const { t } = useTranslation();
    return (
        <Modal className="" title={title} open={visible} footer={null} onCancel={onCancel}>
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