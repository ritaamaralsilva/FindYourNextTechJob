import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ao carregar a app, verifica se já existe uma sessão válida via cookie
  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Erro ao verificar sessão", err);
      } finally {
        setLoading(false);
      }
    };

    verificarSessao();
  }, []);

  const login = async (authData) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(authData),
    });

    if (!response.ok) {
      console.error("Falha na autenticação");
      return false;
    }

    const data = await response.json();
    setUser(data.user);
    return true;
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
