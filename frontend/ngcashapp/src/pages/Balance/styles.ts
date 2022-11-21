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

  p {
    color: #f0f0f0;
    font-size: 1.4rem;
  }
`;

export const MakeATransactionButton = styled.button`
  margin-top: 1rem;
  background-color: #fff;
  width: 120px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
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
