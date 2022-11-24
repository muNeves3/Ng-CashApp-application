import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  BalanceContainer,
  Content,
  CreateTransactionContainer,
  FilterButton,
  GetTransactionsContainer,
  LogoutButton,
  MakeATransactionButton,
  TransactionsFilter,
} from "./styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import List from "@material-ui/core/List";
import DatePicker from "react-date-picker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../../components/Transaction/Transaction";

function Balance() {
  const [balance, setBalance] = useState(0);
  const [creditedAccountUsername, setCreditedAccountUsername] = useState("");
  const [transactionValue, setTransactionValue] = useState(0);
  const [cashInOut, setCashInOut] = useState<string | any>("cash-in");
  const [fromDate, setFromDate] = useState<Date | any>(new Date());
  const [userTransactions, setUserTransactions] = useState([]);
  const [toDate, setToDate] = useState<Date | any>();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const getUserBalance = useCallback(async () => {
    if (user.user !== undefined) {
      const response = await axios.get(
        `http://localhost:3001/account/balance?userId=${user.user.id}`,
        {
          headers: {
            authorization: user.accessToken,
          },
        }
      );

      setBalance(response.data);
    }
  }, [user]);

  const getUserTransactions = useCallback(async () => {
    if (fromDate === undefined || fromDate === undefined) {
      toast.error("O filtro deve ter uma data de início");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3001/transactions", {
        params: {
          userId: user.user.id,
          userAccountId: user.user.accountId,
          cashIn: cashInOut === "cash-in" ? true : false,
          cashOut: cashInOut === "cash-out" ? true : false,
          fromDate: fromDate,
          toDate: toDate,
        },
        headers: {
          authorization: user.accessToken,
        },
      });
      console.log(response);
      setUserTransactions(response.data);
      toast.success("Filtrado com sucesso!");
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [
    cashInOut,
    fromDate,
    toDate,
    user.accessToken,
    user.user.accountId,
    user.user.id,
  ]);

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
      getUserTransactions();
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
    if (user == null || user.user === undefined) {
      navigate("/login");
    }
    if (user.user != null || user.user === undefined) {
      getUserBalance();
    }
  }, [user]);

  useEffect(() => {
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      console.log("ERRO: " + msg);
      navigate("/login");
    };
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
          <Autocomplete
            options={["cash-in", "cash-out"]}
            style={{ width: 180, marginRight: 25, fontSize: 12 }}
            onChange={(event, newValue) => {
              debugger;
              if (newValue !== null) {
                setCashInOut(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cash-In/Cash-Out"
                variant="outlined"
              />
            )}
          />

          <DatePicker
            onChange={(e: any) => {
              debugger;
              setFromDate(e);
            }}
            value={fromDate}
          />
          <DatePicker
            onChange={(e: any) => {
              debugger;
              setToDate(e);
            }}
            value={toDate}
          />

          <FilterButton onClick={() => getUserTransactions()}>
            Filtrar
          </FilterButton>
        </TransactionsFilter>

        <List style={{ maxHeight: "40%", overflow: "auto", marginTop: 15 }}>
          {userTransactions.map((transaction: any) => {
            return (
              <Transaction
                data={new Date(transaction.createdAt).toLocaleDateString(
                  "pt-BR"
                )}
                de={transaction.de}
                para={transaction.para}
                valor={transaction.value}
                key={transaction.TransactionId}
              />
            );
          })}
        </List>
      </GetTransactionsContainer>
    </Content>
  );
}

export default Balance;
