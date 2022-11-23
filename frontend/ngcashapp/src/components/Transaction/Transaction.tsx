import react, { useState } from "react";
import { Container } from "./styles";

type TransactionProps = {
  de: string;
  para: string;
  data: string;
  valor: number;
};

function Transaction(props: TransactionProps) {
  return (
    <Container>
      <p>de: {props.de}</p>
      <p>para: {props.para}</p>
      <p>valor: {props.valor}</p>
      <p>data: {props.data}</p>
    </Container>
  );
}

export { Transaction };
