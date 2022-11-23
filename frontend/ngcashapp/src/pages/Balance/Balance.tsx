import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  BalanceContainer,
  Content,
  CreateTransactionContainer,
  GetTransactionsContainer,
  LogoutButton,
  MakeATransactionButton,
  TransactionsFilter,
} from "./styles";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../../components/Transaction/Transaction";

function Balance() {
  const [balance, setBalance] = useState(0);
  const [creditedAccountUsername, setCreditedAccountUsername] = useState("");
  const [transactionValue, setTransactionValue] = useState(0);
  const [cashIn, setCashIn] = useState(true);
  const [cashOut, setCashOut] = useState(false);
  const [fromDate, setFromDate] = useState(
    new Date().toLocaleDateString("en-US")
  );
  const [userTransactions, setUserTransactions] = useState([]);
  const [toDate, setToDate] = useState<any>();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const getUserBalance = useCallback(async () => {
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

  const getUserTransactions = useCallback(async () => {
    const response = await axios.get("http://localhost:3001/transactions", {
      params: {
        userId: user.user.id,
        userAccountId: user.user.accountId,
        cashOut: cashOut,
        cashIn: cashIn,
        // fromDate: fromDate,
        // toDate: toDate,
      },
      headers: {
        authorization: user.accessToken,
      },
    });
    setUserTransactions(response.data);

    console.log(response);
  }, []);

  const createTransaction = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/transactions",
        {
          debitedAccountId: user.user.accountId,
          creditedAccountUsername,
          value: transactionValue,
          userId: user.user.id,
        },
        {
          headers: {
            authorization: user.accessToken,
          },
        }
      );

      toast.success("Transação realizada com sucesso!");
      return response;
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }, [creditedAccountUsername, transactionValue]);

  const logout = useCallback(async () => {
    localStorage.removeItem("@Ngcash:user");
    setUser({});

    navigate("/login");
  }, []);

  useEffect(() => {
    if (user == null || user.user == null) {
      navigate("/login");
    }
    if (user.user != null) {
      getUserBalance();
    }
  }, [user, getUserBalance, balance]);

  useEffect(() => {
    getUserTransactions();
  }, []);

  return (
    <Content>
      <CreateTransactionContainer>
        <h3>Crie uma nova transação: </h3>
        <label htmlFor="creditedUsername">Nome do usuário a receber: </label>
        <input
          type="text"
          id="creditedUsername"
          value={creditedAccountUsername}
          placeholder="Digite o nome do usuário aqui"
          onChange={(e) => {
            setCreditedAccountUsername(e.target.value);
          }}
        />

        <label htmlFor="transactionValue">Valor: </label>
        <input
          type="number"
          id="transactionValue"
          value={transactionValue}
          placeholder="Digite o nome do usuário aqui"
          onChange={(e) => setTransactionValue(+e.target.value)}
        />
        <MakeATransactionButton
          onClick={() => {
            createTransaction().then((response) => {
              getUserBalance();
              setCreditedAccountUsername("");
              setTransactionValue(0);
              if (response) {
                setBalance(response.data.transaction.debitedAccount.balance);
              }
            });
          }}
        >
          Fazer a transação
        </MakeATransactionButton>
      </CreateTransactionContainer>

      <BalanceContainer>
        <ToastContainer />
        <h3>Seu saldo:</h3>
        <p>R$ {balance.toFixed(2)}</p>
        <LogoutButton onClick={() => logout()}>Sair</LogoutButton>
      </BalanceContainer>

      <GetTransactionsContainer>
        <TransactionsFilter>
          <label htmlFor="cashIn">Cash-in</label>
          <input
            type="checkbox"
            id="cashIn"
            checked={!!cashIn}
            onChange={(e) => {
              debugger;
              if (cashOut === true) {
                setCashOut(false);
              }
              setCashIn(!!e.target.checked);
            }}
          />

          <label htmlFor="cashOut">Cash-out</label>
          <input
            type="checkbox"
            id="cashOut"
            checked={!!cashOut}
            onChange={(e) => {
              if (cashIn === true) {
                setCashIn(false);
              }
              setCashOut(!!e.target.checked);
            }}
          />

          <input
            type="date"
            id="fromDate"
            name="begin"
            min="1990-01-01"
            max="2090-12-31"
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            id="fromDate"
            name="begin"
            min="1990-01-01"
            max="2090-12-31"
            onChange={(e) => setToDate(e.target.value)}
          />
        </TransactionsFilter>

        {userTransactions.map((transaction: any) => {
          return (
            <Transaction
              data={new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
              de={transaction.de}
              para={transaction.para}
              valor={transaction.value}
              key={transaction.id}
            />
          );
        })}
      </GetTransactionsContainer>
    </Content>
  );
}

export default Balance;
