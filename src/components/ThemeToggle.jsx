import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";

// Bouton flottant (visible sur toutes les pages, voir App.js) qui bascule
// entre mode sombre et mode clair. L'icône représente l'action, pas l'état
// actuel : soleil pour "passer en clair", lune pour "passer en sombre".
const ThemeToggle = ({ mode, onToggle }) => {
  const isDark = mode === "dark";
  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={onToggle}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? <BsSunFill /> : <BsMoonStarsFill />}
    </button>
  );
};

export default ThemeToggle;
