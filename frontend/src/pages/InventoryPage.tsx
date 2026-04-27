import { useEffect, useState } from "react";
import { api, Product } from "@/services/api";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { Card } from "@/components/feedback/Card";
import { Badge } from "@/components/feedback/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Skeleton } from "@/components/feedback/Skeleton";
import { ProductModal } from "@/components/ProductModal";
import styles from "./InventoryPage.module.css";

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !showLowStockOnly || p.stock <= p.minimum_stock;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a.stock <= a.minimum_stock && b.stock > b.minimum_stock) return -1;
      if (a.stock > a.minimum_stock && b.stock <= b.minimum_stock) return 1;
      return a.name.localeCompare(b.name);
    });

  const getStockStatus = (stock: number, minimum: number) => {
    if (stock <= minimum) return "danger";
    if (stock <= minimum * 1.5) return "warning";
    return "success";
  };

  const getStockColor = (stock: number, minimum: number) => {
    const status = getStockStatus(stock, minimum);
    if (status === "danger") return "danger";
    if (status === "warning") return "warning";
    return "success";
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Inventario</h1>
        </div>
        <div className={styles.skeletonTable}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <Skeleton height="60px" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Inventario</h1>
        <Button variant="primary" onClick={() => setShowProductModal(true)}>
          + Nuevo producto
        </Button>
      </div>

      <div className={styles.controls}>
        <Input
          type="text"
          placeholder="Buscar producto o SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.currentTarget.checked)}
          />
          <span>Stock bajo ({products.filter((p) => p.stock <= p.minimum_stock).length})</span>
        </label>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Sin productos"
          description={
            searchTerm || showLowStockOnly
              ? "No hay productos que coincidan con tu búsqueda"
              : "Comienza agregando tu primer producto al inventario"
          }
          action={{
            label: "+ Agregar producto",
            onClick: () => setShowProductModal(true),
          }}
        />
      ) : (
        <>
          <div className={styles.desktopTable}>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className={styles.productName}>{product.name}</td>
                    <td className={styles.sku}>{product.sku}</td>
                    <td className={`${styles.stock} ${styles[getStockColor(product.stock, product.minimum_stock)]}`}>
                      {product.stock}
                    </td>
                    <td>{product.minimum_stock}</td>
                    <td>
                      <Badge
                        variant={
                          product.stock <= product.minimum_stock
                            ? "danger"
                            : product.stock <= product.minimum_stock * 1.5
                              ? "warning"
                              : "success"
                        }
                      >
                        {product.stock <= product.minimum_stock
                          ? "Stock bajo"
                          : product.stock <= product.minimum_stock * 1.5
                            ? "Al límite"
                            : "En stock"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.mobileCards}>
            {filteredProducts.map((product) => (
              <Card key={product.id} className={styles.productCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <p className={styles.cardProductName}>{product.name}</p>
                    <p className={styles.cardSku}>{product.sku}</p>
                  </div>
                  <Badge
                    variant={
                      product.stock <= product.minimum_stock
                        ? "danger"
                        : product.stock <= product.minimum_stock * 1.5
                          ? "warning"
                          : "success"
                    }
                  >
                    {product.stock <= product.minimum_stock
                      ? "Bajo"
                      : product.stock <= product.minimum_stock * 1.5
                        ? "Límite"
                        : "OK"}
                  </Badge>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.statItem}>
                    <span>Stock actual</span>
                    <span className={`${styles.stockValue} ${styles[getStockColor(product.stock, product.minimum_stock)]}`}>
                      {product.stock}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span>Stock mínimo</span>
                    <span>{product.minimum_stock}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className={styles.pagination}>
            <p>Mostrando {filteredProducts.length} de {products.length} productos</p>
          </div>
        </>
      )}

      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSuccess={() => {
          setShowProductModal(false);
          loadProducts();
        }}
      />
    </div>
  );
}
