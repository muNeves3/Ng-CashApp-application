import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Content,
  LoginContainer,
  LoginForm,
  SubmitLoginButton,
} from "./styles";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser, user } = useUser();

  async function loginUser(username: string, password: string) {
    try {
      const response = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      });

      localStorage.setItem("@Ngcash:user", JSON.stringify(response.data));
      setUser(response.data);
      navigate("/balance");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error.response);
    }
  }

  useEffect(() => {
    debugger;
    if (user.user != null) {
      navigate("/balance");
    }
  });

  return (
    <Content>
      <ToastContainer />
      <h3>Login</h3>
      <LoginContainer>
        <LoginForm>
          <label htmlFor="username">
            username <br />
          </label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">
            password <br />
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </LoginForm>
        <SubmitLoginButton onClick={() => loginUser(username, password)}>
          <p>Login</p>
        </SubmitLoginButton>
        <Link to="/">
          <p>Não possui uma conta? Cadastre-se aqui</p>
        </Link>
      </LoginContainer>
    </Content>
  );
}

export default Login;
