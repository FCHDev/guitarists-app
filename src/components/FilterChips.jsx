import Chip from "@mui/material/Chip";

// Un groupe de filtres compact, sous forme de puces (chips) : remplace les
// trois anciens composants Switch*.jsx (Terre/Paradis, Zone, Tri), qui
// dupliquaient la même logique avec des boutons radio dans des encadrés
// épais. Les chips prennent beaucoup moins de place, ce qui règle le
// problème de largeur sur mobile, tout en restant lisibles grâce au petit
// label au-dessus de chaque groupe.
const FilterChips = ({ label, options, value, onChange }) => {
  return (
    <div className="filter-group">
      <span className="filter-group-label">{label}</span>
      <div className="filter-chips">
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            clickable
            onClick={() => onChange(option.value)}
            className={
              value === option.value
                ? "filter-chip filter-chip-active"
                : "filter-chip"
            }
          />
        ))}
      </div>
    </div>
  );
};

export default FilterChips;
