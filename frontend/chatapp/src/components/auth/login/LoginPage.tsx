import { useState } from "react";
import { Auth } from "../../../models";
import "../Auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks";
import { Form as FormikForm, Formik } from "formik";
import { Form, InputGroup } from "react-bootstrap";

interface Props {
  onLogin?: () => void;
}
export default function LoginPage({ onLogin }: Props) {
  const [loginData, setLoginData] = useState<Auth>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="auth-page">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => console.log(values.username)}
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
            <FormikForm className="auth-form">
              {/* <div className="auth-form"> */}
              <Form.Control
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="username"
              />
              <Form.Control
                name="password"
                value={values.password}
                onChange={(e) => handleChange(e)}
                placeholder="password"
              />
              {/* </div> */}
            </FormikForm>
          </div>
        )}
      </Formik>
    </div>
  );

  function submit(): void {
    login(loginData)
      .then(() => {
        onLogin?.();
        navigate("/");
      })
      .catch(() => alert("login failed"));
  }
}
