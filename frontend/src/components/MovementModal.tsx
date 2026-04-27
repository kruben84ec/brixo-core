import { useEffect, useState } from "react";
import { api, Product, RegisterMovementRequest } from "@/services/api";
import { Modal } from "@/components/feedback/Modal";
import { BottomSheet } from "@/components/feedback/BottomSheet";
import { Input } from "@/components/primitives/Input";
import { Button } from "@/components/primitives/Button";
import { useToast } from "@/components/feedback/Toast";
import styles from "./MovementModal.module.css";

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isMobile?: boolean;
}

type MovementType = "ENTRADA" | "SALIDA" | "AJUSTE";
type Step = "type" | "product" | "quantity";

export function MovementModal({
  isOpen,
  onClose,
  onSuccess,
  isMobile = false,
}: MovementModalProps) {
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>("type");
  const [movementType, setMovementType] = useState<MovementType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const handleClose = () => {
    setStep("type");
    setMovementType(null);
    setSelectedProduct(null);
    setQuantity("");
    setSearchTerm("");
    setError("");
    onClose();
  };

  const handleSelectType = (type: MovementType) => {
    setMovementType(type);
    setStep("product");
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setStep("quantity");
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !movementType || !quantity.trim()) {
      setError("Completa todos los campos");
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError("La cantidad debe ser un número positivo");
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterMovementRequest = {
        type: movementType,
        quantity: movementType === "SALIDA" ? -qty : qty,
      };
      await api.registerMovement(selectedProduct.id, payload);
      addToast(
        `Movimiento ${movementType} registrado correctamente`,
        "success",
        3000
      );
      onSuccess();
      handleClose();
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al registrar movimiento";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ComponentToUse = isMobile ? BottomSheet : Modal;

  return (
    <ComponentToUse
      isOpen={isOpen}
      title={
        step === "type"
          ? "Registrar movimiento"
          : step === "product"
            ? `Selecciona producto`
            : `Cantidad a ${movementType === "ENTRADA" ? "agregar" : movementType === "SALIDA" ? "quitar" : "ajustar"}`
      }
      onClose={handleClose}
      primaryAction={
        step === "type"
          ? undefined
          : step === "product"
            ? undefined
            : {
                label: "Confirmar",
                onClick: handleSubmit,
                loading,
              }
      }
      secondaryAction={{
        label: step === "type" ? "Cancelar" : "Atrás",
        onClick:
          step === "type"
            ? handleClose
            : () => setStep(step === "product" ? "type" : "product"),
      }}
    >
      <div className={styles.content}>
        {step === "type" && (
          <div className={styles.typeSelection}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleSelectType("ENTRADA")}
              className={styles.typeButton}
            >
              📥 Entrada
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleSelectType("SALIDA")}
              className={styles.typeButton}
            >
              📤 Salida
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleSelectType("AJUSTE")}
              className={styles.typeButton}
            >
              ⚙️ Ajuste
            </Button>
          </div>
        )}

        {step === "product" && (
          <div className={styles.productSelection}>
            <Input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              autoFocus
            />
            <div className={styles.productList}>
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  className={styles.productItem}
                  onClick={() => handleSelectProduct(product)}
                  disabled={loading}
                >
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{product.name}</p>
                    <p className={styles.productSku}>{product.sku}</p>
                  </div>
                  <p className={styles.productStock}>Stock: {product.stock}</p>
                </button>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className={styles.emptyState}>Sin resultados</p>
            )}
          </div>
        )}

        {step === "quantity" && selectedProduct && (
          <div className={styles.quantityForm}>
            <div className={styles.productSummary}>
              <p className={styles.productName}>{selectedProduct.name}</p>
              <p className={styles.productSku}>{selectedProduct.sku}</p>
              <p className={styles.stockInfo}>
                Stock actual: {selectedProduct.stock}
              </p>
            </div>
            <Input
              type="number"
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.currentTarget.value);
                if (error) setError("");
              }}
              disabled={loading}
              autoFocus
              min="1"
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}
      </div>
    </ComponentToUse>
  );
}
