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

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();

  async function createUser(username: string, password: string) {
    try {
      const response = await axios.post("http://localhost:3001/user", {
        username,
        password,
      });

      if (response.data.message !== null) {
        toast.error(response.data.message);
      }
      if (response.data.user !== null && response.data.user !== undefined) {
        toast.success("User created!");
        navigate("/login");
      } else {
        toast.error("User not created!");
      }
      console.log(response);
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
      <h3>Cadastrar</h3>
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
        <SubmitLoginButton onClick={() => createUser(username, password)}>
          <p>Cadastrar</p>
        </SubmitLoginButton>
        <Link to="/Login">
          <p>Já é cadastrado? Faça login aqui</p>
        </Link>
      </LoginContainer>
    </Content>
  );
}

export default Signup;
