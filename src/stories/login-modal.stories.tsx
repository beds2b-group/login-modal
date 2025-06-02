import type { Meta, StoryObj } from '@storybook/react';
import LoginModal from '../login-modal';

const meta: Meta<typeof LoginModal> = {
  component: LoginModal,
  title: 'LoginModal',
};

export default meta;

type Story = StoryObj<typeof LoginModal>;

export const Default: Story = {};


export const opened: Story = {
  args: {
    availableLanguages: ['es', 'en', 'mx', 'us'],
    defaultLanguage: 'en',
    data: {
      usernamePlaceholder: 'Username',
      passwordPlaceholder: 'Password',
      requiredFieldError: 'This field is required',
      reminderPasswordLink: 'Forgot your password?',
      formErrorMessage: 'There was an error with your login. Please try again.',
    },
    styles: {
      primaryColor: '#1890ff',
      secondaryColor: '#f0f0f0',
    },
    urlToRegister: '/en/example/register',
    title: 'Login',
    visible: true,



  },
};