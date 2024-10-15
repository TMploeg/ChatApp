import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Must have at least 8 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase character")
    .matches(/[A-Z]/, "Must contain at least one uppercase character")
    .matches(/[0-9]/, "Must contain at least one digit")
    .matches(/[!@#$%^&+=]/, "Must contain at least one special character"),
  passwordConfirmation: Yup.string()
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export { LoginSchema, RegisterSchema };
