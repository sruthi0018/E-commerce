import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export default function CategoryModal({ open, onClose, onSubmit, defaultValues }) {
  const schema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
  });

  const { handleSubmit, register, reset, formState: { errors } } = useForm({
    defaultValues: { name: "", ...defaultValues },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        reset({ ...defaultValues });
      } else {
        reset({ name: "" });
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
        <h3>{defaultValues ? "Edit Category" : "Add Category"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.row}>
            <label style={styles.label}>Name</label>
            <input {...register("name")} style={styles.input} />
            {errors.name && <p style={styles.error}>{errors.name.message}</p>}
          </div>

          <div style={{ ...styles.row, justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" onClick={handleClose} style={styles.cancel}>Discard</button>
            <button type="submit" style={styles.submit}>{defaultValues ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "#fff", borderRadius: 10, width: 400, padding: 20, display: "flex", flexDirection: "column" },
  form: { display: "flex", flexDirection: "column", gap: 15 },
  row: { display: "flex", alignItems: "center", gap: 10 },
  label: { width: "30%", fontWeight: "bold" },
  input: { flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" },
  cancel: { padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: 6, cursor: "pointer" },
  submit: { padding: "8px 16px", backgroundColor: "#facc15", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer" },
  error: { color: "red", fontSize: 12 },
};
