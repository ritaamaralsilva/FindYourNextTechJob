import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div>
      <h1>Algo correu mal</h1>
      <p>{error?.statusText || error?.message}</p>
      <Link to="/">Voltar às vagas</Link>
    </div>
  );
}
