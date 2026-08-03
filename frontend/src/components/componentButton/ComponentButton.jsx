import { useState, useEffect, useRef } from "react";
import "./ComponentButton.css";

// hook genérico: mantém "true" durante pelo menos "minDuration" ms a partir do
// momento em que "active" passa a true, mesmo que "active" volte a false mais depressa
function useMinDuration(active, minDuration) {
  const [visible, setVisible] = useState(false);
  const inicioRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (active) {
      inicioRef.current = Date.now();
      setVisible(true);
      clearTimeout(timeoutRef.current);
    } else {
      const tempoDecorrido = Date.now() - (inicioRef.current ?? Date.now());
      const espera = Math.max(minDuration - tempoDecorrido, 0);
      timeoutRef.current = setTimeout(() => setVisible(false), espera);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [active, minDuration]);

  return visible;
}

// ícone de refresh usado no variant="refresh"
function RefreshIcon({ spinning }) {
  return (
    <svg
      className={`cbtn-refresh-icon ${
        spinning ? "cbtn-refresh-icon--spinning" : ""
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

export function ComponentButton({
  children,
  functionForClick,
  isActive,
  disabled = false,
  variant, // "refresh" | undefined
  loading = false, // true enquanto a ação do variant="refresh" está em curso
  minSpinDuration = 500, // ms mínimos visíveis (ícone a rodar + cor azul), mesmo que loading seja muito rápido
  type = "button", // "button" | "submit" | "reset"
}) {
  // o ícone e a cor usam o MESMO valor "visualLoading", para nunca ficarem dessincronizados
  const visualLoading = useMinDuration(loading, minSpinDuration);

  const baseClass = isActive ? "cbtnActive" : "cbtn";
  const variantClass =
    variant === "refresh"
      ? "cbtn-refresh"
      : variant === "cta"
      ? "cbtn-cta"
      : "";
  const loadingClass =
    variant === "refresh" && visualLoading ? "cbtn-refresh--loading" : "";

  return (
    <button
      type={type}
      onClick={functionForClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${loadingClass}`.trim()}
    >
      {variant === "refresh" && <RefreshIcon spinning={visualLoading} />}
      {children}
    </button>
  );
}
