import { useParams } from "react-router-dom";

export default function VagaDetalhe() {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalhe da vaga {id}</h1>
    </div>
  );
}
