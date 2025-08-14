import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { GetAllCategories } from "../../redux/slices/category";
import { useDispatch, useSelector } from "react-redux";

export default function ProductModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) {
  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .positive(),
    stock: Yup.number()
      .typeError("Stock must be a number")
      .required("Stock is required")
      .min(0),
    images: Yup.array().of(Yup.mixed()),
  });

  console.log(defaultValues, "def");

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: defaultValues?.category?._id,
      price: "",
      stock: 0,
      images: [],
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const [imagePreviews, setImagePreviews] = useState([]);
  const { categories } = useSelector((state) => state.categories);
  useEffect(() => {
    dispatch(GetAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        reset({
          ...defaultValues,
          images: defaultValues.images || [],
          category: defaultValues.category?._id || "",
        });
        setImagePreviews(defaultValues.images || []);
      } else {
        reset({
          title: "",
          description: "",
          category: defaultValues?.category?._id || "",
          price: "",
          stock: 0,
          images: [],
        });
        setImagePreviews([]);
      }
    }
  }, [open, defaultValues, reset]);

  const handleClose = () => {
    reset();
    setImagePreviews([]);
    onClose();
  };

  const handleImageChange = (files) => {
    const existingFiles = watch("images") || [];
    const newFiles = Array.from(files);

    // Keep both existing and new images
    const updatedFiles = [...existingFiles, ...newFiles];
    setValue("images", updatedFiles);

    const updatedPreviews = [...imagePreviews, ...newFiles.map((file) => file)];
    setImagePreviews(updatedPreviews);
  };

  const removeImageField = (index) => {
    const files = watch("images") || [];
    const updatedFiles = files.filter((_, i) => i !== index);
    setValue("images", updatedFiles);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  if (!open) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.scrollArea}>
          <h3>{defaultValues ? "Edit Product" : "Add Product"}</h3>
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.row}>
              <label style={styles.label}>Title</label>
              <input {...register("title")} style={styles.input} />
              {errors.title && (
                <p style={styles.error}>{errors.title.message}</p>
              )}
            </div>

            <div style={styles.row}>
              <label style={styles.label}>Description</label>
              <textarea {...register("description")} style={styles.textarea} />
            </div>

            <div style={styles.row}>
              <label style={styles.label}>Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select {...field} style={styles.input}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.category && (
                <p style={styles.error}>{errors.category.message}</p>
              )}
            </div>

            <div style={styles.row}>
              <label style={styles.label}>Price</label>
              <input
                type="number"
                {...register("price")}
                style={styles.inputSmall}
              />
              {errors.price && (
                <p style={styles.error}>{errors.price.message}</p>
              )}
            </div>

            <div style={styles.row}>
              <label style={styles.label}>Stock</label>
              <input
                type="number"
                {...register("stock")}
                style={styles.inputSmall}
              />
              {errors.stock && (
                <p style={styles.error}>{errors.stock.message}</p>
              )}
            </div>

            <div style={styles.row}>
              <label style={styles.label}>Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files)}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {imagePreviews.map((img, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={
                        typeof img === "string"
                          ? `${process.env.REACT_APP_UPLOAD_URL}${img}`
                          : URL.createObjectURL(img)
                      }
                      alt={`preview-${index}`}
                      style={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "2px 6px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ ...styles.row, justifyContent: "flex-end" }}>
              <button type="button" onClick={handleClose} style={styles.cancel}>
                Discard
              </button>
              <button type="submit" style={styles.submit}>
                {defaultValues ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  scrollArea: { padding: 20, overflowY: "auto", maxHeight: "70vh" },
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    borderRadius: 10,
    width: 700,
    maxHeight: "80vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  form: { display: "flex", flexDirection: "column", gap: 15 },
  row: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  label: { width: "20%", fontWeight: "bold" },
  input: { flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" },
  textarea: {
    flex: 1,
    padding: 10,
    height: 60,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  inputSmall: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: -5,
  },
  button: {
    padding: "6px 12px",
    backgroundColor: "#e2e8f0",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  removeVariant: {
    padding: "4px 8px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  removeImage: {
    padding: "4px 8px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  previewImage: {
    width: 70,
    height: 70,
    objectFit: "cover",
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  cancel: {
    padding: "8px 16px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  submit: {
    padding: "8px 16px",
    backgroundColor: "#facc15",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: { color: "red", fontSize: 12 },
};
