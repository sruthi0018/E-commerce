import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function OrderModal({ open, onClose, onSubmit, defaultValues }) {
  const schema = Yup.object().shape({
    status: Yup.string().required("Order status is required"),
  });

  const { handleSubmit, register, reset, formState: { errors } } = useForm({
    defaultValues: { status: "placed", ...defaultValues },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        reset({ ...defaultValues });
      } else {
        reset({ status: "placed" });
      }
    }
  }, [open, defaultValues, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h3>Order Details</h3>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          {defaultValues && (
            <div style={{ marginBottom: 15 }}>
              <p><strong>Order ID:</strong> {defaultValues._id}</p>
              <p><strong>User:</strong> {defaultValues.user.name}</p>
              <p><strong>Shipping Address:</strong> {defaultValues.shippingAddress}</p>
              <p><strong>Total Price:</strong> ${defaultValues.totalPrice}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {defaultValues.items.map((item, i) => (
                  <li key={i}>{item.title} x {item.quantity} (${item.price})</li>
                ))}
              </ul>
            </div>
          )}

          <div style={styles.row}>
            <label style={styles.label}>Status</label>
            <select {...register("status")} style={styles.input}>
              <option value="placed">Placed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && <p style={styles.error}>{errors.status.message}</p>}
          </div>

          <div style={{ ...styles.row, justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" onClick={handleClose} style={styles.cancel}>Discard</button>
            <button type="submit" style={styles.submit}>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "#fff", borderRadius: 10, width: 500, padding: 20, display: "flex", flexDirection: "column" },
  form: { display: "flex", flexDirection: "column", gap: 15 },
  row: { display: "flex", alignItems: "center", gap: 10 },
  label: { width: "30%", fontWeight: "bold" },
  input: { flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" },
  cancel: { padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: 6, cursor: "pointer" },
  submit: { padding: "8px 16px", backgroundColor: "#facc15", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer" },
  error: { color: "red", fontSize: 12 },
};
