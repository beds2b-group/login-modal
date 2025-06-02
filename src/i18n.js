import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          usernamePlaceholder: "Username",
          passwordPlaceholder: "Password",
          requiredFieldError: "This field is required",
          reminderPasswordLink: "Forgot your password?",
          formErrorMessage: "There was an error with your login. Please try again.",
          accessTextButton: "Access",
          notRegisterText: "I'm not registered",
        },
      },
      es: {
        translation: {
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
