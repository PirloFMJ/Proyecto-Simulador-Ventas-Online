// MARK: CategoryFilter - selector reutilizable de categoría de productos

function CategoryFilter({ categories, value, onChange }) {
  return (
    <section className="products-filters">
      <label className="products-filter-label">
        Categoría
        <select
          className="products-filter-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all"
                ? "Todas"
                : cat === "laptops"
                ? "Laptops"
                : cat === "peripherals"
                ? "Periféricos"
                : cat === "accessories"
                ? "Accesorios"
                : cat === "audio"
                ? "Audio"
                : cat}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

export default CategoryFilter;

