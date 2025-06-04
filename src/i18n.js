import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          title: "Login",
          "forget-password-email-sent-title": "Email Sent",
          "forget-password-modal-title": "Forgot Password",
          "forget-password-form.email": "Email",
          "validations.required-field": "This field is required",
          "forget-password-form.cancel": "Cancel",
          "forget-password-form.submit": "Submit",
          usernamePlaceholder: "Username",
          passwordPlaceholder: "Password",
          requiredFieldError: "This field is required",
          reminderPasswordLink: "Forgot your password?",
          formErrorMessage: "There was an error with your login. Please try again.",
          accessTextButton: "Access",
          notRegisterText: "I'm not registered",
          "forget-password-email-sent-description": "An email has been sent to <strong>{{email}}</strong> with instructions to recover your password.",
        },
      },
      es: {
        translation: {
          "forget-password-email-sent-title": "Correo electrónico enviado",
          "forget-password-email-sent-description": "Se ha enviado un email a la dirección <strong>{{email}}</strong> con las instrucciones para recuperar la contraseña.",
          "forget-password-modal-title": "Olvidé mi contraseña",
          "forget-password-form.email": "Correo electrónico",
          "forget-password-form.cancel": "Cancelar",
          "validations.required-field": "Este campo es obligatorio",
          "forget-password-form.submit": "Enviar",
          title: "Iniciar sesión",
          usernamePlaceholder: "Usuario",
          passwordPlaceholder: "Contraseña",
          requiredFieldError: "Este campo es obligatorio",
          reminderPasswordLink: "¿Olvidaste tu contraseña?",
          formErrorMessage: "Hubo un error en tu inicio de sesión. Por favor intenta de nuevo.",
          accessTextButton: "Entrar",
          notRegisterText: "No estoy registrado",
        },
      },
      pt:{
        translation: {
          title: "Login",
          "forget-password-email-sent-title": "E-mail enviado",
          "forget-password-email-sent-description": "Um e-mail foi enviado para <strong>{{email}}</strong> com instruções para recuperar sua senha.",
          "forget-password-modal-title": "Esqueci minha senha",
          "validations.required-field": "Este campo é obrigatório",
          "forget-password-form.email": "E-mail",
          "forget-password-form.cancel": "Cancelar",
          "forget-password-form.submit": "Enviar",
          usernamePlaceholder: "Usuário",
          passwordPlaceholder: "Senha",
          requiredFieldError: "Este campo é obrigatório",
          reminderPasswordLink: "Esqueceu sua senha?",
          formErrorMessage: "Houve um erro no seu login. Por favor, tente novamente.",
          accessTextButton: "Acessar",
          notRegisterText: "Não estou registrado",
        },
      },
      fr:{
        translation: {
          title: "Connexion",
          "forget-password-email-sent-title": "E-mail envoyé",
          "forget-password-email-sent-description": "Un e-mail a été envoyé à <strong>{{email}}</strong> avec des instructions pour récupérer votre mot de passe.",
          "forget-password-modal-title": "Mot de passe oublié",
          "validations.required-field": "Ce champ est obligatoire",
          "forget-password-form.email": "E-mail",
          "forget-password-form.cancel": "Annuler",
          "forget-password-form.submit": "Envoyer",
          usernamePlaceholder: "Nom d'utilisateur",
          passwordPlaceholder: "Mot de passe",
          requiredFieldError: "Ce champ est obligatoire",
          reminderPasswordLink: "Mot de passe oublié ?",
          formErrorMessage: "Une erreur s'est produite lors de votre connexion. Veuillez réessayer.",
          accessTextButton: "Accéder",
          notRegisterText: "Je ne suis pas inscrit",
        },
      },
      us:{
        translation: {
          title: "Login",
          "forget-password-email-sent-title": "Email Sent",
          "forget-password-email-sent-description": "An email has been sent to <strong>{{email}}</strong> with instructions to recover your password.",
          "forget-password-modal-title": "Forgot Password",
          "forget-password-form.email": "Email",
          "validations.required-field": "This field is required",
          "forget-password-form.cancel": "Cancel",
          "forget-password-form.submit": "Submit",
          usernamePlaceholder: "Username",
          passwordPlaceholder: "Password",
          requiredFieldError: "This field is required",
          reminderPasswordLink: "Forgot your password?",
          formErrorMessage: "There was an error with your login. Please try again.",
          accessTextButton: "Access",
          notRegisterText: "I'm not registered",
        },
      },
      
      // Añade más idiomas aquí...
    },
    lng: "en", // idioma por defecto
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
