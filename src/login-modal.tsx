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

export interface LoginModalProps {
    title: string,
    className: string,
    visible: boolean,
    onCancel: () => void,
    data: DataLoginModalProps,
    onLogin: (username: string, password: string) => void,
    onForgetPassword: () => void,
    haveError: boolean,
    getFormattedUrl: (path: string) => string
}


export default function LoginModal({ title, visible, className, onCancel, data, onLogin, onForgetPassword, haveError, getFormattedUrl }: LoginModalProps) {
    return (
        <Modal className={className} title={title} open={visible} footer={null} onCancel={onCancel}>
            <LoginForm getFormattedUrl={getFormattedUrl} data={data} haveError={haveError} onLogin={onLogin} doingLogin={false} onForgetPassword={onForgetPassword} />
        </Modal>
    );
}