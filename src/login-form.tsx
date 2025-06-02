import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import './login-form.css';
import { LoadingOutlined } from "@ant-design/icons";
import { DataLoginModalProps, StylesForLoginModalProps } from "./login-modal";

interface LoginFormComponentProps {
    onLogin: (username: string, password: string) => void,
    doingLogin: boolean,
    onForgetPassword: () => void,
    haveError: boolean,
    data: DataLoginModalProps,
    availableLanguages: string[],
    defaultLanguage: string,
    urlToRegister?: string,
}

const LoginFormComponent = ({ onLogin, onForgetPassword, haveError, doingLogin, data, availableLanguages, defaultLanguage, urlToRegister }: LoginFormComponentProps) => {

    const [form] = useForm();
    const onFinish = (): void => {
        onLogin(form.getFieldValue("username"), form.getFieldValue("password"));
    }
    const IsLaguagePresentInUrl = (): boolean => availableLanguages.some(language => window.location.pathname.split("/").length > 0 && window.location.pathname.split("/")[1] == language)
    const GetLanguageInUrl = (): string => IsLaguagePresentInUrl() ? `/${window.location.pathname.split("/")[1]}` : '';
    const GetDefaultLanguage = (): string => defaultLanguage;
    const getFormattedUrl = (path: string): string => `${(IsLaguagePresentInUrl() ? GetLanguageInUrl() : GetDefaultLanguage())}/${path}`;

    return (
        <div className="login-form">
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label={data.usernamePlaceholder || "Username"}
                    name="username"
                    rules={[{ required: true, message: data.requiredFieldError || "Error" }]}
                >
                    <Input className="app-input" />
                </Form.Item>

                <Form.Item
                    label={data.passwordPlaceholder || "Password"}
                    name="password"
                    rules={[{ required: true, message: data.requiredFieldError || "Error" }]}
                >
                    <Input.Password className="app-input" />
                </Form.Item>
                <div className="reminder-password-link">
                    <span className="app-colored-main-font app-link" onClick={onForgetPassword}>{data.reminderPasswordLink || "Forgot your password?"}</span>
                </div>

                {
                    haveError ?
                        <div className="error-message">
                            {data.formErrorMessage || "There was an error with your login. Please try again."}
                        </div>
                        :
                        ''
                }

                <Button size="large" className="app-button btn-submit" htmlType="submit">
                    {doingLogin ? <LoadingOutlined /> : ''}{data.accessTextButton || "Access"}
                </Button>



            </Form>
            <div className="not-register">
                <a className="app-colored-main-font app-link" href={`${urlToRegister ?? getFormattedUrl('register')}`}>{data.notRegisterTest || "I'm not registered"}</a>
            </div>
        </div>
    )
}

export default LoginFormComponent;