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
      // Añade más idiomas aquí...
    },
    lng: "en", // idioma por defecto
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
