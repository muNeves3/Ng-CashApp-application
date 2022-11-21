import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Content, LogoutButton, MakeATransactionButton } from "./styles";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

function Balance() {
  const [balance, setBalance] = useState(0);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const getUserBalance = useCallback(async () => {
    console.log(user);

    const response = await axios.get(
      `http://localhost:3001/account/balance?userId=${user.user.id}`,
      {
        headers: {
          authorization: user.accessToken,
        },
      }
    );

    setBalance(response.data);
  }, [user]);

  const logout = useCallback(async () => {
    localStorage.removeItem("@Ngcash:user");
    setUser({});
    navigate("/login");
  }, []);

  useEffect(() => {
    if (user == null || user.user == null) {
      navigate("/login");
    }
    getUserBalance();
  });

  return (
    <Content>
      <ToastContainer />
      <h3>Seu saldo:</h3>
      <p>R$ {balance.toFixed(2)}</p>
      <MakeATransactionButton>Fazer uma transação</MakeATransactionButton>
      <LogoutButton onClick={() => logout()}>Sair</LogoutButton>
    </Content>
  );
}

export default Balance;
