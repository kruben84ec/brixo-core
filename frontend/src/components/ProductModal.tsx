import { useState } from "react";
import { api, CreateProductRequest } from "@/services/api";
import { Modal } from "@/components/feedback/Modal";
import { Input } from "@/components/primitives/Input";
import { useToast } from "@/components/feedback/Toast";
import styles from "./ProductModal.module.css";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductModal({ isOpen, onClose, onSuccess }: ProductModalProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    minimum_stock: "10",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("El nombre del producto es requerido");
      return;
    }
    if (!formData.sku.trim()) {
      setError("El SKU es requerido");
      return;
    }
    if (parseInt(formData.minimum_stock) < 0) {
      setError("El stock mínimo debe ser >= 0");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateProductRequest = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        minimum_stock: parseInt(formData.minimum_stock),
      };
      await api.createProduct(payload);
      addToast("Producto creado exitosamente", "success", 3000);
      setFormData({ name: "", sku: "", minimum_stock: "10" });
      onSuccess();
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al crear producto";
      if (err.response?.status === 409) {
        setError("El SKU ya existe");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", sku: "", minimum_stock: "10" });
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Nuevo producto"
      onClose={handleClose}
      primaryAction={{
        label: "Crear producto",
        onClick: handleSubmit,
        loading,
      }}
      secondaryAction={{
        label: "Cancelar",
        onClick: handleClose,
      }}
    >
      <div className={styles.form}>
        <Input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          autoFocus
        />
        <Input
          type="text"
          name="sku"
          placeholder="SKU (ej: PROD-001)"
          value={formData.sku}
          onChange={handleChange}
          disabled={loading}
        />
        <Input
          type="number"
          name="minimum_stock"
          placeholder="Stock mínimo"
          value={formData.minimum_stock}
          onChange={handleChange}
          disabled={loading}
          min="0"
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </Modal>
  );
}
