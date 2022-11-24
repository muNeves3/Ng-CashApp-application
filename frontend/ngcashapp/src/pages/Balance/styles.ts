import styled from "styled-components";

export const Content = styled.div`
  height: 100vh;
  width: 100vw;
  background: #515052;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const BalanceContainer = styled.div`
  height: 100vh;
  width: 25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    color: #f0f0f0;
    font-size: 1.5rem;
  }

  p {
    color: #f0f0f0;
    font-size: 1.4rem;
  }
`;

export const CreateTransactionContainer = styled.div`
  height: 100vh;
  width: 25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    color: #f0f0f0;
    font-size: 2rem;
  }

  p {
    color: #f0f0f0;
    font-size: 1.4rem;
  }

  label {
    color: #f0f0f0;
    margin-top: 1rem;
  }

  input {
    width: 15rem;
    border-radius: 6px;
    border: none;
    padding: 3px;
    margin-top: 0.4rem;
  }
`;

export const GetTransactionsContainer = styled.div`
  height: 100vh;
  width: 50rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const TransactionsFilter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.1rem;
  margin-bottom: 1rem;
`;

export const MakeATransactionButton = styled.button`
  margin-top: 1rem;
  background-color: #fff;
  width: 100px;
  height: 35px;
  text-align: center;
  border-radius: 9px;
  font-size: 0.9rem;
  color: #000;
  border: none;
`;

export const LogoutButton = styled.button`
  margin-top: 7%;
  width: 80px;
  height: 30px;
  background-color: #000;
  color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  font-size: 0.7rem;
`;

export const FilterButton = styled.button`
  width: 80px;
  height: 70;
  background-color: #000;
  border-radius: 8px;
  margin-left: 0.3rem;
  color: #fff;
  margin-right: 10px;
`;
