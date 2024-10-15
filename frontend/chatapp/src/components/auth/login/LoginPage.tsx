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

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => console.log(values.username)}
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
          }) => (
            <div>
              <FormikForm onSubmit={handleSubmit} className="auth-form">
                <InputGroup>
                  <Form.Control
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    placeholder="username"
                    isInvalid={touched.username && !!errors.username}
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup>
                  <Form.Control
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    value={values.password}
                    onChange={(e) => handleChange(e)}
                    placeholder="password"
                    isInvalid={touched.password && !!errors.password}
                    onBlur={handleBlur}
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
          )}
        </Formik>
      </div>
    </div>
  );
}
