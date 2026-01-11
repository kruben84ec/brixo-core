import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Brixo</h1>
      <p>Control simple de tu inventario</p>

      <h2>Productos</h2>

      {products.length === 0 && <p>No hay productos</p>}

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} — Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
