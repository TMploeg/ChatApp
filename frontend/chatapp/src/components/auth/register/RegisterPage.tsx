import { Formik } from "formik";
import { useState } from "react";
import { RegisterSchema } from "../AuthSchemas";
import { Form as FormikForm } from "formik";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAppNavigate, useAuth } from "../../../hooks";
import AppRoute from "../../../enums/AppRoute";

interface Props {
  onRegister?: () => void;
}
export default function RegisterPage({ onRegister }: Props) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState<boolean>(false);

  const { register } = useAuth();
  const navigate = useAppNavigate();

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-form-title">Register</div>
        <Formik
          initialValues={{
            username: "",
            password: "",
            passwordConfirmation: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            register(values)
              .then(() => {
                onRegister?.();
                navigate(AppRoute.HOME);
              })
              .catch(() => {
                alert("register failed");
                setSubmitting(false);
              });
          }}
          validationSchema={RegisterSchema}
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
                      onClick={() => setPasswordVisible((visible) => !visible)}
                      size="lg"
                    >
                      {passwordVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <InputGroup hasValidation>
                    <Form.Control
                      {...getCommonProps("passwordConfirmation")}
                      type={passwordConfirmationVisible ? "text" : "password"}
                    />
                    <Button
                      onClick={() =>
                        setPasswordConfirmationVisible((visible) => !visible)
                      }
                      size="lg"
                    >
                      {passwordConfirmationVisible ? (
                        <BsEyeSlashFill />
                      ) : (
                        <BsEyeFill />
                      )}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.passwordConfirmation}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Button type="submit" disabled={isSubmitting} size="lg">
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
                placeholder: placeholder ?? splitName(name),
                isInvalid: touched[name] && !!errors[name],
                isValid: touched[name] && !errors[name],
                onBlur: handleBlur,
              };
            }

            function splitName(name: string): string {
              if (name.length === 0) {
                return name;
              }

              let result: string = "";

              for (let i = 0; i < name.length; i++) {
                const current = name[i];

                result +=
                  i === 0
                    ? current.toUpperCase()
                    : current === current.toUpperCase()
                    ? " " + current
                    : current;
              }

              return result;
            }
          }}
        </Formik>
        <Link to="/login">go to login</Link>
      </div>
    </div>
  );
}
