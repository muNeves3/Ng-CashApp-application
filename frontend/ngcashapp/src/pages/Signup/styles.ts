import styled from "styled-components";

export const Content = styled.div`
  height: 100vh;
  width: 100vw;
  background: #212022;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    color: #f0f0f0;
    font-size: 2rem;
  }
`;

export const LoginContainer = styled.div`
  width: 30%;
  height: 50%;
  background-color: #f0f0f0;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LoginForm = styled.form`
  height: 70%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  label {
    margin-right: 31%;
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 5px;
  }

  input {
    width: 50%;
    border: 1px solid #000;
    border-radius: 7px;
    padding: 2px;
    margin-bottom: 25px;
  }
`;

export const SubmitLoginButton = styled.button`
  width: 35%;
  height: 30px;
  margin-top: 10px;
  background-color: #212022;
  border-color: #212022;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    color: #f0f0f0;
    font-weight: 500;
  }
`;
