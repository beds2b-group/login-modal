import { Button, Form, Input, Modal } from "antd";
import { ReactNode, useState } from "react";
import ReactDOM from "react-dom/client";
import css from "./login-modal.css"; // esto será un string
import { useForm } from "antd/es/form/Form";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import { StyleProvider } from '@ant-design/cssinjs';

export interface StylesForLoginModalProps {
    primaryColor?: string,
    secondaryColor?: string,
}
export type TypeLoginModalProps = "default" | "modal";
export type EnvProps = "dev" | "pro";
export interface LoginModalProps {
    visible: boolean,
    language: string,
    styles: StylesForLoginModalProps,
    urlToRegister?: string,
    clientAppDomain: string,
    apiKey: string,
    mode?: TypeLoginModalProps,
    env: EnvProps

}
class LoginModalElement extends HTMLElement {
    private mountPoint: HTMLDivElement;
    private root: ReactDOM.Root | null = null;
    private styleElement: HTMLStyleElement;
    private props: Partial<LoginModalProps> = {};
    static get observedAttributes() {
        return [
            "visible",
            "primary-color",
            "secondary-color",
            "language",
            "url-to-register",
            "client-app-domain",
            "api-key",
            "mode"
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

    connectedCallback() {
        if (!this.root) {
            this.root = ReactDOM.createRoot(this.mountPoint);
        }
        this.props = {
            visible: this.getAttribute("visible") === "true",
            language: this.getAttribute("language") || "es",
            styles: {
                primaryColor: this.getAttribute("primary-color") || "#1890ff",
                secondaryColor: this.getAttribute("secondary-color") || "#40a9ff"
            },
            urlToRegister: this.getAttribute("url-to-register") || "",
            apiKey: this.getAttribute("api-key") || "",
            clientAppDomain: this.getAttribute("client-app-domain") || "",
            mode: this.getAttribute("mode") as TypeLoginModalProps || "default",
            env: this.getAttribute("env") as EnvProps || "pro"
        };
        if (this.props.mode === "default" && !this.shadowRoot!.contains(this.styleElement)) {
            this.shadowRoot!.appendChild(this.styleElement);
        }
        this.renderReactComponent();
    }
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (oldValue === newValue) return;

        switch (name) {
            case "visible":
                this.props.visible = newValue === "true";
                break;
            case "client-app-domain":
                this.props.clientAppDomain = newValue || "";
                break;
            case "primary-color":
            case "secondary-color":
                this.props.styles = {
                    ...this.props.styles,
                    [name === "primary-color" ? "primaryColor" : "secondaryColor"]: newValue || ""
                };
                break;
            case "language":
                this.props.language = newValue || "es";
                break;

            case "url-to-register":
                this.props.urlToRegister = newValue || "";
                break;
            case "api-key":
                this.props.apiKey = newValue || "";
                break;
            case "mode":
                this.props.mode = newValue as TypeLoginModalProps || "default";
                break;
            case "env":
                this.props.env = newValue as EnvProps || "pro";
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

    private updateColors = (styles: StylesForLoginModalProps) => {
        this.styleElement.textContent = `
    :${this.props.mode === "modal" ? "root" : "host"} {
      --primary-client-color-login-modal: ${styles.primaryColor || '#1890ff'};
      --secondary-client-color-login-modal: ${styles.secondaryColor || '#40a9ff'};
    }
    ${css}
  `;
    };
    private setLanguage(lang: string) {
        return i18n.changeLanguage(lang);
    }
    private renderReactComponent() {
        if (!this.root) return;

        this.setLanguage(this.props.language || "es").then(() => {
            this.root!.render(
                this.props.mode === "modal" ? <LoginModal {...(this.props as LoginModalProps)} />
                    : <StyleProvider container={this.shadowRoot!}>
                        <LoginModal {...(this.props as LoginModalProps)} />
                    </StyleProvider>


            );
        });

    }
}

customElements.define("login-modal", LoginModalElement);

export default function LoginModal({
    visible,
    language,
    urlToRegister,
    clientAppDomain,
    apiKey,
    mode,
    env
    }: LoginModalProps) {

    const apiUrlBase = env == "pro" ? "pro.beds2b.es" : "dev-pro.beds2b.es";

    const [form] = useForm();
    const [formForgetPassword] = useForm();
    const [doingLogin, setDoingLogin] = useState(false);
    const [loadingForgetPassword, setLoadingForgetPassword] = useState(false);
    const [visibleState, setVisibleState] = useState(visible);
    const [haveError, sethaveError] = useState(false);
    const [showForgetPassword, setShowForgetPassword] = useState(false);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authority', clientAppDomain);
    headers.append('X-Api-Key', apiKey);
    const { t } = useTranslation();

    const IsLaguagePresentInUrl = (): boolean => window.location.pathname.split("/").length > 0 && window.location.pathname.split("/")[1] == language;
    const GetLanguageInUrl = (): string => IsLaguagePresentInUrl() ? `/${window.location.pathname.split("/")[1]}` : '';
    const getFormattedUrl = (path: string): string => `${(IsLaguagePresentInUrl() ? GetLanguageInUrl() : language)}/${path}`;


    const showHostNotification = (type: string, message: string, description: string | ReactNode) => {
        const event = new CustomEvent("show-notification", {
            detail: { type, message, description },
            bubbles: true,
            composed: true
        });
        window.dispatchEvent(event);
    };
    const onFinish = (): void => {
        const username = form.getFieldValue("username");
        const password = form.getFieldValue("password");

        setDoingLogin(true);

        fetch(`https://${apiUrlBase}/api/v1/Users/widgetlogin/${apiKey}?username=${username}&password=${password}`, { headers })
            .then((res) => res.json())
            .then((response) => {
                window.location.href = response.data
            })
            .catch(() => {
                sethaveError(true);
            })
            .finally(() => { setDoingLogin(false) });

    }
    const onCancelPush = (): void => {
        form.resetFields();
        setShowForgetPassword(false);
    }
    const onFinishFormForgetPassword = () => {
        setLoadingForgetPassword(true);
        try {
            const email: string = formForgetPassword.getFieldValue("email");
            const body = {
                email: email,
                app: "wa"
            }

            fetch(`https://${apiUrlBase}/api/v1/Users/RecoverPassword`, { headers, body: JSON.stringify(body), method: "POST" })
                .then(response => {
                    if (!response.ok) {
                        showHostNotification("error", t("forget-password-error-title"), t("forget-password-error-description"));
                    }
                    return response.json();
                }).then((r) => {
                    if (r && r.typeText === "success") {
                        showHostNotification("success", t("forget-password-email-sent-title"), HTMLReactParser(t("forget-password-email-sent-description", { email })));

                        setShowForgetPassword(false);
                    }
                }).catch((error) => {
                    console.error('Error sending recovery email:', error);
                    showHostNotification("error", t("forget-password-error-title"), t("forget-password-error-description"));
                })
                .finally(() => {
                    setLoadingForgetPassword(false);
                    formForgetPassword.resetFields();
                })



        } catch (error) {
            console.error('Error recovering password :', error);
            return null;
        }

    }

    // #endregion 
    return (
        mode === "default" ?
            <>
                <Modal className="app-modal" title={t("forget-password-modal-title")} open={showForgetPassword} footer={null} onCancel={() => setShowForgetPassword(false)}>
                    <div className="forget-password-form">
                        <Form form={formForgetPassword} onFinish={onFinishFormForgetPassword} layout="horizontal">
                            <Form.Item
                                label={t("forget-password-form.email")}
                                name="email"
                                rules={[{ required: true, message: t("validations.required-field")! }]}
                            >
                                <Input className="app-input" type="email" />
                            </Form.Item>
                            <div className="actions">
                                <Button style={{ borderRadius: "2px" }} type="default" key="back" onClick={onCancelPush}>
                                    {t("forget-password-form.cancel")}
                                </Button>
                                <Button disabled={loadingForgetPassword} className="app-button" key="submit" htmlType="submit" type="primary" loading={loadingForgetPassword}>
                                    {t("forget-password-form.submit")}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
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
                            <span className="app-colored-main-font app-link" onClick={() => setShowForgetPassword(true)}>{t("reminderPasswordLink") || "Forgot your password?"}</span>
                        </div>

                        {haveError ?
                            <div className="error-message">
                                {t("formErrorMessage") || "There was an error with your login. Please try again."}
                            </div>
                            :
                            ''}

                        <Button size="large" className="app-button btn-submit" htmlType="submit">
                            {doingLogin ? <LoadingOutlined /> : ''}{t("accessTextButton") || "Access"}
                        </Button>



                    </Form>
                    <div className="not-register">
                        <a className="app-colored-main-font app-link" href={`${urlToRegister ?? getFormattedUrl('register')}`}>{t("notRegisterText") || "I'm not registered"}</a>
                    </div>
                </div>
            </>
            :
            <>
                <Modal className="app-modal" title={t("forget-password-modal-title")} open={showForgetPassword} footer={null} onCancel={() => setShowForgetPassword(false)}>
                    <div className="forget-password-form">
                        <Form form={formForgetPassword} onFinish={onFinishFormForgetPassword} layout="horizontal">
                            <Form.Item
                                label={t("forget-password-form.email")}
                                name="email"
                                rules={[{ required: true, message: t("validations.required-field")! }]}
                            >
                                <Input className="app-input" type="email" />
                            </Form.Item>
                            <div className="actions">
                                <Button style={{ borderRadius: "2px" }} type="default" key="back" onClick={onCancelPush}>
                                    {t("forget-password-form.cancel")}
                                </Button>
                                <Button disabled={loadingForgetPassword} className="app-button" key="submit" htmlType="submit" type="primary" loading={loadingForgetPassword}>
                                    {t("forget-password-form.submit")}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal><Modal onCancel={() => setVisibleState(false)} className="" title={t('title')} open={visibleState} footer={null}>
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
                                <span className="app-colored-main-font app-link" onClick={() => setShowForgetPassword(true)}>{t("reminderPasswordLink") || "Forgot your password?"}</span>
                            </div>

                            {haveError ?
                                <div className="error-message">
                                    {t("formErrorMessage") || "There was an error with your login. Please try again."}
                                </div>
                                :
                                ''}

                            <Button size="large" className="app-button btn-submit" htmlType="submit">
                                {doingLogin ? <LoadingOutlined /> : ''}{t("accessTextButton") || "Access"}
                            </Button>



                        </Form>
                        <div className="not-register">
                            <a className="app-colored-main-font app-link" href={`${urlToRegister ?? getFormattedUrl('register')}`}>{t("notRegisterText") || "I'm not registered"}</a>
                        </div>
                    </div>
                </Modal>
            </>

    )
}

function HTMLReactParser(arg0: string): import("react").ReactNode {
    throw new Error("Function not implemented.");
}
