import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppNavigate, useAuth } from "../../../hooks";
import { Form as FormikForm, Formik } from "formik";
import { Button, Form, InputGroup } from "react-bootstrap";
import { LoginSchema } from "../AuthSchemas";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "../Auth.css";
import AppRoute from "../../../enums/AppRoute";

interface Props {
  onLogin?: () => void;
}
export default function LoginPage({ onLogin }: Props) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useAppNavigate();

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-form-title">Login</div>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values, { setSubmitting }) => {
            login(values)
              .then(() => {
                onLogin?.();
                navigate(AppRoute.HOME);
              })
              .catch(() => {
                alert("login failed");
                setSubmitting(false);
              });
          }}
          validationSchema={LoginSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
            isSubmitting,
          }) => {
            return (
              <div>
                <FormikForm onSubmit={handleSubmit} className="auth-form">
                  <InputGroup hasValidation>
                    <Form.Control {...getCommonProps("username")} />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <InputGroup hasValidation>
                    <Form.Control
                      {...getCommonProps("password")}
                      type={passwordVisible ? "text" : "password"}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => setPasswordVisible((visible) => !visible)}
                      size="lg"
                    >
                      {passwordVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    size="lg"
                    onClick={() => console.log("Login Clicked!")}
                  >
                    Login
                  </Button>
                </FormikForm>
              </div>
            );

            function getCommonProps(
              name: keyof typeof values,
              placeholder?: string
            ) {
              return {
                name,
                value: values[name],
                onChange: handleChange,
                placeholder: placeholder ?? name,
                isInvalid: touched[name] && !!errors[name],
                isValid: touched[name] && !errors[name],
                onBlur: handleBlur,
              };
            }
          }}
        </Formik>
        <Link to="/register">go to register</Link>
      </div>
    </div>
  );
}
