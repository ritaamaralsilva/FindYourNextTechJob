import "./App.css";

import Homepage from "./pages/Vagas/Homepage";
import VagaDetalhe from "./pages/Vagas/VagaDetalhe";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout";
import ErrorPage from "./pages/Error";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Auth/Signup";
import LoginForm from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Perfil from "./pages/Perfil/Perfil";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import MeusCurriculos from "./pages/Curriculos/MeusCurriculos";
import MinhasCandidaturas from "./pages/Candidaturas/MinhasCandidaturas";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import GestaoFontesVagas from "./pages/Admin/GestaoFontesVagas";
import GestaoVagas from "./pages/Admin/GestaoVagas";
import VerificarEmail from "./pages/Auth/VerificarEmail";
import ResetPassword from "./pages/Auth/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/vagas/:id", element: <VagaDetalhe /> },
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verificar-email", element: <VerificarEmail /> },
      { path: "/reset-password", element: <ResetPassword /> },
      {
        path: "/perfil",
        element: <ProtectedRoute element={<Perfil />} />,
      },
      {
        path: "/cv",
        element: (
          <ProtectedRoute
            element={<MeusCurriculos />}
            allowedRole="candidato"
          />
        ),
      },
      {
        path: "/candidaturas",
        element: (
          <ProtectedRoute
            element={<MinhasCandidaturas />}
            allowedRole="candidato"
          />
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute element={<AdminDashboard />} allowedRole="admin" />
        ),
      },
      {
        path: "/admin/fontes",
        element: (
          <ProtectedRoute element={<GestaoFontesVagas />} allowedRole="admin" />
        ),
      },
      {
        path: "/admin/vagas",
        element: (
          <ProtectedRoute element={<GestaoVagas />} allowedRole="admin" />
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
