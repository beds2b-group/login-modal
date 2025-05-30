import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";

import './LoginForm.scss';
import { LoadingOutlined } from "@ant-design/icons";
import { DataLoginModalProps } from "./login-modal";

interface LoginFormComponentProps {
    onLogin: (username: string, password: string) => void,
    doingLogin: boolean,
    onForgetPassword: () => void,
    haveError: boolean,
    data: DataLoginModalProps,
    getFormattedUrl: (path: string) => string
}

const LoginFormComponent = ({ onLogin, onForgetPassword, haveError, doingLogin, data, getFormattedUrl }: LoginFormComponentProps) => {


    const [form] = useForm();

    const onFinish = (): void => {
        onLogin(form.getFieldValue("username"), form.getFieldValue("password"));
    }

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
                <a className="app-colored-main-font app-link" href={`${getFormattedUrl('register')}`} onClick={() => { window.location.href = getFormattedUrl('register') }}>{data.notRegisterTest || "I'm not registered"}</a>
            </div>
        </div>
    )
}

export default LoginFormComponent;