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
      <p className="De">de: {props.de}</p>
      <p className="Para">para: {props.para}</p>
      <p className="Valor">valor: {props.valor}</p>
      <p className="Data">data: {props.data}</p>
    </Container>
  );
}

export { Transaction };
