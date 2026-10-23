import { App, Button, Form, Input, Modal } from "antd";
import { ReactNode, use, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import css from "./login-modal.css"; // esto será un string
import { useForm } from "antd/es/form/Form";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import i18n from "./i18n.js";
import { StyleProvider } from '@ant-design/cssinjs';
import HTMLReactParser from "html-react-parser";

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
    env: EnvProps,
    onOpenRecoverPassword?: () => void;
    onCloseRecoverPassword?: () => void;
    showRecoverPassword?: boolean;
    getContainer?: () => HTMLElement;

}
export const showHostNotification = (type: string, message: string, description: string | ReactNode) => {
    const event = new CustomEvent("show-notification", {
        detail: { type, message, description },
        bubbles: true,
        composed: true
    });
    window.dispatchEvent(event);
};

// antd solo bloquea el scroll del <body> cuando el modal se pinta directamente en document.body.
// Los nuestros van a un contenedor propio, así que lo bloqueamos aquí (mismo CSS que usa antd).
const useBodyScrollLock = (lock: boolean) => {
    useEffect(() => {
        if (!lock) return;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const style = document.createElement("style");
        style.textContent = `html body { overflow-y: hidden; ${scrollbarWidth > 0 ? `width: calc(100% - ${scrollbarWidth}px);` : ""} }`;
        document.head.appendChild(style);
        return () => style.remove();
    }, [lock]);
};

class LoginModalElement extends HTMLElement {
    private mountPoint: HTMLDivElement;
    private root: ReactDOM.Root | null = null;
    private styleElement: HTMLStyleElement;
    // Capa para los modales: un <div> en <body> con su propio shadow root (ver constructor)
    private overlayHost: HTMLDivElement;
    private overlayRoot: ShadowRoot;
    private overlayStyleElement: HTMLStyleElement;
    private popupContainer: HTMLDivElement;
    private props: Partial<LoginModalProps> = {};
    private showRecoverPasswordModal = false;
    static get observedAttributes() {
        return [
            "visible",
            "primary-color",
            "secondary-color",
            "language",
            "url-to-register",
            "client-app-domain",
            "api-key",
            "mode",
            "env"
        ];
    }
    constructor() {
        super();
        this.mountPoint = document.createElement("div");
        const shadow = this.attachShadow({ mode: "open" });

        //  Crear un <style> con el contenido del CSS y añadirlo al shadowRoot
        this.styleElement = document.createElement("style");
        this.styleElement.textContent = css;
        shadow.appendChild(this.styleElement);  //  DENTRO DEL SHADOW


        shadow.appendChild(this.mountPoint);

        // Los modales de antd se pintan en un portal. Por defecto va a document.body: fuera del shadow DOM,
        // sin nuestro CSS ni las variables de color y expuesto al CSS del host. Los mandamos a esta capa,
        // que tiene su propio shadow root y se coloca con placeOverlay().
        this.overlayHost = document.createElement("div");
        // Fuera del flujo (no mueve el maquetado de donde se cuelgue) y con z-index propio
        this.overlayHost.style.position = "absolute";
        // Las teclas de nuestros modales no llegan al host: Escape cerraría también el popup de Elementor
        this.overlayHost.addEventListener("keyup", (e) => e.stopPropagation());
        this.overlayRoot = this.overlayHost.attachShadow({ mode: "open" });
        this.overlayStyleElement = document.createElement("style");
        this.popupContainer = document.createElement("div");
        this.overlayRoot.append(this.overlayStyleElement, this.popupContainer);

        this.updateColors({});
    }

    connectedCallback() {
        this.placeOverlay();
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

        this.updateColors(this.props.styles || {});
        this.renderReactComponent();
    }
    disconnectedCallback() {
        // Diferido: si el host solo mueve el elemento en el DOM se vuelve a conectar y no hay que desmontar
        queueMicrotask(() => {
            if (this.isConnected || !this.root) return;
            this.root.unmount();
            this.root = null;
            this.showRecoverPasswordModal = false;
            this.overlayHost.remove();
        });
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
        this.updateColors(this.props.styles || {});
        this.renderReactComponent();
    }
    setProps(newProps: Partial<LoginModalProps>) {
        this.props = { ...this.props, ...newProps };
        this.updateColors(this.props.styles || {});
        this.renderReactComponent();
    }
    private updateColors = (styles: StylesForLoginModalProps) => {
        this.styleElement.textContent = `
        :host {
            --primary-client-color-login-modal: ${styles.primaryColor || "#1890ff"};
            --secondary-client-color-login-modal: ${styles.secondaryColor || "#40a9ff"};
        }

        ${css}


        .app-button {
            border-radius: 2px !important;
            background: var(--primary-client-color-login-modal) !important;
            border-color: var(--primary-client-color-login-modal) !important;
            color: white !important;
        }

        .app-button:hover {
            transition: all 0.5s !important;
            background-color: var(--secondary-client-color-login-modal) !important;
            border-color: var(--secondary-client-color-login-modal) !important;
            color: white !important;
        }

        .app-cancel {
            border-radius: 2px !important;
            padding: 0 16px;
            height: 38px;
        }

        .forget-password-form .actions {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }


        .forget-password-form .ant-btn {
            font-family: inherit !important;
            font-size: 16px !important;
        }
    `;
        // Los modales viven en la capa de <body>: mismo CSS y mismas variables de color
        this.overlayStyleElement.textContent = this.styleElement.textContent;
    };



    private setLanguage(lang: string) {
        return i18n.changeLanguage(lang);
    }
    private handleOpenRecoverModal = () => {
        this.showRecoverPasswordModal = true;
        this.renderReactComponent(); // vuelve a renderizar con el modal abierto
    };
    private handleCloseRecoverModal = () => {
        this.showRecoverPasswordModal = false;
        this.renderReactComponent(); // vuelve a renderizar con el modal abierto
    };
    private getPopupContainer = () => this.popupContainer;
    // Los avisos (notification) también van a la capa, por encima de los modales
    private overlayNotificationConfig = { getContainer: this.getPopupContainer };

    // Si <login-modal> está dentro de una capa del host (p. ej. un popup de Elementor, position: fixed y
    // z-index 9999), la capa de modales cuelga de ella y queda por encima. Si colgara de <body>, el popup
    // taparía "Recuperar contraseña" y además Elementor cerraría su popup al hacer clic en nuestro modal
    // (lo toma como un clic "fuera"). Sin capa del host, cuelga de <body>. Mínimo, el z-index de antd (1000).
    private placeOverlay() {
        let parent: Element = document.body;
        let zIndex = 1000;
        for (let el: Element | null = this; el && el !== document.body; el = el.parentElement ?? (el.getRootNode() as ShadowRoot).host ?? null) {
            const style = getComputedStyle(el);
            const z = parseInt(style.zIndex, 10);
            if (!Number.isNaN(z)) zIndex = Math.max(zIndex, z + 1);
            // Una capa con transform/filter no vale: los modales (position: fixed) se colocarían respecto a ella
            if (el !== this && style.position === "fixed" && style.transform === "none" && style.filter === "none") {
                parent = el;
            }
        }
        this.overlayHost.style.zIndex = String(zIndex);
        if (this.overlayHost.parentElement !== parent) {
            parent.appendChild(this.overlayHost);
        }
    }

    private renderReactComponent() {
        if (!this.root) return;

        this.setLanguage(this.props.language || "es").then(() => {
            if (this.isConnected) this.placeOverlay();
            const loginModal = (
                <LoginModal
                    showRecoverPassword={this.showRecoverPasswordModal}
                    onOpenRecoverPassword={this.handleOpenRecoverModal}
                    onCloseRecoverPassword={this.handleCloseRecoverModal}
                    getContainer={this.getPopupContainer}
                    {...(this.props as LoginModalProps)} />
            );

            // Cada StyleProvider mete los estilos de antd en el shadow root donde se pinta su contenido
            this.root?.render(
                this.props.mode === "modal" ?
                    // Un único modal: "¿Olvidaste tu contraseña?" cambia su contenido en vez de abrir otro encima
                    <StyleProvider container={this.overlayRoot}>
                        <App component={false} notification={this.overlayNotificationConfig}>
                            {loginModal}
                        </App>
                    </StyleProvider>
                    : <>
                        <StyleProvider container={this.overlayRoot}>
                            <App component={false} notification={this.overlayNotificationConfig}>
                                <ModalRecoverPassword getContainer={this.getPopupContainer} onClose={this.handleCloseRecoverModal} showmodal={this.showRecoverPasswordModal} clientAppDomain={this.props.clientAppDomain || ''} apiUrlBase={this.props.env == "pro" ? "pro.beds2b.es" : "dev-pro.beds2b.es"} />
                            </App>
                        </StyleProvider>
                        <StyleProvider container={this.shadowRoot!}>
                            {loginModal}
                        </StyleProvider>
                    </>
            );
        });

    }
}

// La web puede incluir el script más de una vez (p. ej. uno por cada popup de Elementor): se registra solo la primera
if (!customElements.get("login-modal")) {
    customElements.define("login-modal", LoginModalElement);
}

export default function LoginModal({
    visible,
    language,
    urlToRegister,
    clientAppDomain,
    apiKey,
    mode,
    env,
    onOpenRecoverPassword,
    onCloseRecoverPassword,
    showRecoverPassword = false,
    getContainer
}: LoginModalProps) {

    const apiUrlBase = env == "pro" ? "pro.beds2b.es" : "dev-pro.beds2b.es";

    const [form] = useForm();
    const [doingLogin, setDoingLogin] = useState(false);
    const [visibleState, setVisibleState] = useState(visible);

    // Si el host cambia el atributo "visible" después de montar, el modal lo sigue
    useEffect(() => {
        setVisibleState(visible);
    }, [visible]);
    useBodyScrollLock(mode === "modal" && visibleState);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Host', apiUrlBase);
    headers.append('Authority', clientAppDomain);
    const { t } = useTranslation();

    const IsLaguagePresentInUrl = (): boolean => window.location.pathname.split("/").length > 0 && window.location.pathname.split("/")[1] == language;
    const GetLanguageInUrl = (): string => IsLaguagePresentInUrl() ? `/${window.location.pathname.split("/")[1]}` : '';
    const getFormattedUrl = (path: string): string => `${(IsLaguagePresentInUrl() ? GetLanguageInUrl() : language)}/${path}`;


    const onFinish = (): void => {
        const username = form.getFieldValue("username");
        const password = form.getFieldValue("password");

        setDoingLogin(true);
        form.setFields([
            { name: 'password', errors: [] }
        ])

        fetch(`https://${apiUrlBase}/api/v1/Users/widgetlogin/${apiKey}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, { headers })
            .then((res) => res.json())
            .then((response) => {
                if (response && response.code === 200 && response.data) {
                    window.location.href = response.data
                } else {
                    form.setFields([
                        {
                            name: 'password',
                            errors: [response.message || t("login-error-message")]
                        }
                    ]);
                }
            })
            .catch(() => {
                form.setFields([
                    {
                        name: 'password',
                        errors: [t("login-error-message")]
                    }
                ]);
            })
            .finally(() => { setDoingLogin(false) });

    }


    // #endregion 
    return (
        mode === "default" ?
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
                        <span className="app-colored-main-font app-link"
                            onClick={() => onOpenRecoverPassword?.()}>
                            {t("reminderPasswordLink") || "Forgot your password?"}</span>
                    </div>

                    { /*     <p style={{ color: 'red', minHeight: '22px', marginTop: '0' }}>{errorMessage}</p>*/}
                    <Button size="large" className="app-button btn-submit" htmlType="submit">
                        {doingLogin ? <LoadingOutlined /> : ''}{t("accessTextButton") || "Access"}
                    </Button>



                </Form>
                <div className="not-register">
                    <a className="app-colored-main-font app-link" href={`${urlToRegister ?? getFormattedUrl('register')}`}>{t("notRegisterText") || "I'm not registered"}</a>
                </div>
            </div>
            :
            <Modal
                onCancel={() => setVisibleState(false)}
                // Si se cierra estando en "Recuperar contraseña", al volver a abrir se ve el login
                afterClose={showRecoverPassword ? onCloseRecoverPassword : undefined}
                className="app-modal"
                title={showRecoverPassword ? t("forget-password-modal-title") : t('title')}
                open={visibleState}
                footer={null}
                getContainer={getContainer}
            >
                {showRecoverPassword && (
                    <RecoverPasswordForm apiUrlBase={apiUrlBase} clientAppDomain={clientAppDomain} onClose={onCloseRecoverPassword} />
                )}
                {/* Oculto (no desmontado) para no perder lo escrito al volver de "Recuperar contraseña" */}
                <div className="login-form" hidden={showRecoverPassword}>
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
                            <span className="app-colored-main-font app-link" onClick={() => onOpenRecoverPassword?.()}>{t("reminderPasswordLink") || "Forgot your password?"}</span>
                        </div>

                        <Button size="large" className="app-button btn-submit" htmlType="submit">
                            {doingLogin ? <LoadingOutlined /> : ''}{t("accessTextButton") || "Access"}
                        </Button>



                    </Form>
                    <div className="not-register">
                        <a className="app-colored-main-font app-link" href={`${urlToRegister ?? getFormattedUrl('register')}`}>{t("notRegisterText") || "I'm not registered"}</a>
                    </div>
                </div>
            </Modal>


    )
}

// Modo "default": el formulario de login va en la página y "Recuperar contraseña" se abre en un modal
export function ModalRecoverPassword({ apiUrlBase, clientAppDomain, showmodal = false, onClose, getContainer }: { apiUrlBase: string, clientAppDomain: string, showmodal?: boolean, onClose?: () => void, getContainer?: () => HTMLElement }) {
    const { t } = useTranslation();
    useBodyScrollLock(showmodal);

    return (
        <Modal
            className="app-modal"
            title={t("forget-password-modal-title")}
            open={showmodal}
            footer={null}
            getContainer={getContainer}
            destroyOnHidden
            onCancel={() => onClose?.()}
        >
            <RecoverPasswordForm apiUrlBase={apiUrlBase} clientAppDomain={clientAppDomain} onClose={onClose} />
        </Modal>
    );
}

export function RecoverPasswordForm({ apiUrlBase, clientAppDomain, onClose }: { apiUrlBase: string, clientAppDomain: string, onClose?: () => void }) {
    const { t } = useTranslation();
    // De <App>: los avisos salen en la capa de modales, no en document.body (allí quedarían tapados)
    const { notification } = App.useApp();
    const [formForgetPassword] = useForm();
    const [loadingForgetPassword, setLoadingForgetPassword] = useState(false);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Host', apiUrlBase);
    headers.append('Authority', clientAppDomain);
    const onCancelPush = (): void => {
        formForgetPassword.resetFields();
        onClose?.()
    }

    const onFinishFormForgetPassword = () => {
        setLoadingForgetPassword(true);
        try {
            const email: string = formForgetPassword.getFieldValue("email");
            const body = {
                email: email,
                app: "wa"
            }

            fetch(`https://${apiUrlBase}/api/v1/Users/RecoverPasswordFromWidget`, {
                headers,
                body: JSON.stringify(body),
                method: "POST"
            })
                .then(async response => {

                    // Parseas JSON una sola vez
                    const json = await response.json();

                    // Puedes comprobar error Y mostrar mensaje del JSON
                    if (!response.ok || json.type !== 1) {
                        // Esto evita que siga al siguiente .then(). El aviso de error se da una sola vez, en el catch
                        return Promise.reject(json.message || t("forget-password-error-description"));
                    }

                    // Si todo va bien → pasas el JSON al siguiente .then()
                    return json;
                })
                .then(r => {
                    notification.success({
                        message: t("operation-done"),
                        description: r.message,
                    });

                    // Notificación del host
                    showHostNotification(
                        "success",
                        t("forget-password-email-sent-title"),
                        r.message // <-- AQUÍ USAS EL MENSAJE DEL SERVIDOR
                    );

                    // Mostrar mensaje en el formulario
                    //  setSendEmailMessage(r.message); // <-- AQUÍ TAMBIÉN

                    // Enviado: se vuelve al login (modo "modal") o se cierra el modal (modo "default")
                    onCancelPush();
                })

                .catch(error => {
                    // Mensaje del servidor si lo hay; si no (sin red, respuesta no JSON...) el genérico.
                    // No se resetea el formulario para que el usuario pueda corregir el email.
                    const description = typeof error === "string" ? error : t("forget-password-error-description");

                    notification.error({
                        message: t("error"),
                        description,
                    });

                    showHostNotification(
                        "error",
                        t("forget-password-error-title"),
                        description
                    );
                })
                .finally(() => {
                    setLoadingForgetPassword(false);
                });



        } catch (error) {
            console.error('Error recovering password :', error);
            return null;
        }

    }


    return (
        <div className="forget-password-form">
            <Form
                form={formForgetPassword}
                layout="vertical"
                onFinish={onFinishFormForgetPassword}
            >
                <Form.Item
                    label={t("forget-password-form.email")}
                    name="email"
                    rules={[{ required: true, message: t("validations.required-field")! }]}
                >
                    <Input className="app-input" type="email" />
                </Form.Item>



                <div className="actions">
                    <Button
                        type="default"
                        onClick={onCancelPush}
                        className="app-cancel"
                    >
                        {t("forget-password-form.cancel")}
                    </Button>

                    <Button
                        htmlType="submit"
                        className="app-button"
                        loading={loadingForgetPassword}
                        disabled={loadingForgetPassword}
                    >
                        {t("forget-password-form.submit")}
                    </Button>
                </div>
            </Form>
        </div>
    );


}