import { Modal } from "antd";
import LoginForm from "./login-form";


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
    buttonBorderRadious?: string
}
export interface LoginModalProps {
    title: string,
    visible: boolean,
    onCancel: () => void,
    data: DataLoginModalProps,
    onLogin: (username: string, password: string) => void,
    onForgetPassword: () => void,
    haveError: boolean,
    getFormattedUrl: (path: string) => string,
    availableLanguages: string[],
    defaultLanguage: string,
    styles: StylesForLoginModalProps
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
    availableLanguages }: LoginModalProps) {

    return (
        <Modal className="" title={title} open={visible} footer={null} onCancel={onCancel}>
            <LoginForm styles={styles} defaultLanguage={defaultLanguage} availableLanguages={availableLanguages} data={data} haveError={haveError} onLogin={onLogin} doingLogin={false} onForgetPassword={onForgetPassword} />
        </Modal>
    );
}