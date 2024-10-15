import { useState } from "react";
import { Auth } from "../../../models";
import "../Auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks";
import { Form as FormikForm, Formik } from "formik";
import { Button, Form, InputGroup } from "react-bootstrap";
import { LoginSchema } from "../AuthSchemas";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

interface Props {
  onLogin?: () => void;
}
export default function LoginPage({ onLogin }: Props) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => {
            login(values)
              .then(() => {
                onLogin?.();
                navigate("/");
              })
              .catch(() => alert("login failed"));
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
                  <InputGroup>
                    <Form.Control {...getCommonProps("username")} />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <InputGroup>
                    <Form.Control
                      {...getCommonProps("password")}
                      type={passwordVisible ? "text" : "password"}
                    />
                    <Button
                      onClick={() => setPasswordVisible((visible) => !visible)}
                    >
                      {passwordVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
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
                placeholder: placeholder ?? name,
                isInvalid: touched[name] && !!errors[name],
                isValid: touched[name] && !errors[name],
                onBlur: handleBlur,
              };
            }
          }}
        </Formik>
      </div>
    </div>
  );
}
