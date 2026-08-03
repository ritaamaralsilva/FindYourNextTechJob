import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./RootLayout.css";

export default function RootLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    setMenuOpen(false);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, isHomePage]);

  return (
    <>
      <nav className={`vagas-navbar ${scrolled ? "navbar-glass" : ""}`}>
        <div className="vagas-navbar-inner">
          {/* navbar à esquerda */}
          <div className="vagas-navbar-left">
            <NavLink to="/" className="nav-link">
              Vagas
            </NavLink>

            {user?.role === "candidato" && (
              <>
                <NavLink to="/cv" className="nav-link">
                  O meu CV
                </NavLink>
                <NavLink to="/candidaturas" className="nav-link">
                  Candidaturas
                </NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" className="nav-link">
                  Painel
                </NavLink>
                <NavLink to="/admin/fontes" className="nav-link">
                  Fontes
                </NavLink>
                <NavLink to="/admin/vagas" className="nav-link">
                  Gestão de vagas
                </NavLink>
              </>
            )}
          </div>

          {/* nav bar centro */}
          <NavLink to="/" className="vagas-brand">
            FindYourNextTechJob
          </NavLink>

          {/* nav bar à direita */}
          <div className="vagas-navbar-right">
            {user && (
              <NavLink to="/perfil" className="nav-link">
                Perfil
              </NavLink>
            )}

            {!user && (
              <>
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
                <NavLink to="/signup" className="nav-link">
                  Registar
                </NavLink>
              </>
            )}

            {user && (
              <button className="nav-link nav-logout" onClick={logout}>
                Sair
              </button>
            )}
          </div>

          {/* hamburger menu */}
          <button
            className={`hamburger ${menuOpen ? "hamburger-active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
          </button>
        </div>

        {/* menu mobile */}
        <div className={`mobile-menu ${menuOpen ? "mobile-menu-active" : ""}`}>
          <div className="mobile-menu-links">
            <NavLink to="/" className="mobile-link">
              Vagas
            </NavLink>

            {user?.role === "candidato" && (
              <>
                <NavLink to="/cv" className="mobile-link">
                  O meu CV
                </NavLink>
                <NavLink to="/candidaturas" className="mobile-link">
                  Candidaturas
                </NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" className="mobile-link">
                  Painel
                </NavLink>
                <NavLink to="/admin/fontes" className="mobile-link">
                  Fontes
                </NavLink>
                <NavLink to="/admin/vagas" className="mobile-link">
                  Gestão de vagas
                </NavLink>
              </>
            )}

            {user && (
              <NavLink to="/perfil" className="mobile-link">
                Perfil
              </NavLink>
            )}

            {!user && (
              <>
                <NavLink to="/login" className="mobile-link">
                  Login
                </NavLink>
                <NavLink to="/signup" className="mobile-link">
                  Registar
                </NavLink>
              </>
            )}

            {user && (
              <button className="vagas-btn-sair" onClick={logout}>
                Sair
              </button>
            )}
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}
