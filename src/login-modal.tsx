import { Modal } from "antd";
import LoginForm from "./login-form";
import { useEffect } from "react";


export interface DataLoginModalProps {
    usernamePlaceholder?: string,
    passwordPlaceholder?: string,
    requiredFieldError?: string,
    reminderPasswordLink?: string,
    formErrorMessage?: string,
    accessTextButton?: string,
    notRegisterTest?: string,

}
export interface StylesForLoginModalProps {
    primaryColor?: string,
    secondaryColor?: string,
}
export interface LoginModalProps {
    title: string,
    visible: boolean,
    onCancel: () => void,
    data: DataLoginModalProps,
    onLogin: (username: string, password: string) => void,
    onForgetPassword: () => void,
    haveError: boolean,
    availableLanguages: string[],
    defaultLanguage: string,
    styles: StylesForLoginModalProps,
    urlToRegister?: string,

}

export default function LoginModal({
    title,
    visible,
    onCancel,
    data,
    onLogin,
    onForgetPassword,
    haveError,
    defaultLanguage,
    styles,
    urlToRegister,
    availableLanguages }: LoginModalProps) {
    useEffect(() => {
        // Cambiar la variable CSS global con el color recibido
        document.documentElement.style.setProperty("--secondary-client-color", styles.secondaryColor || "#f0f0f0");
        document.documentElement.style.setProperty("--primary-client-color", styles.primaryColor || "#f0f0f0");

    }, [styles]);
    return (
        <Modal className="" title={title} open={visible} footer={null} onCancel={onCancel}>
            <LoginForm urlToRegister={urlToRegister} defaultLanguage={defaultLanguage} availableLanguages={availableLanguages} data={data} haveError={haveError} onLogin={onLogin} doingLogin={false} onForgetPassword={onForgetPassword} />
        </Modal>
    );
}