import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../context/authContext";
import AlertSnackbar from "../components/Dialog/AlertSnackbar";


const schema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required").min(6),
});

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
 const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

const onSubmit = async (formData) => {
  console.log(formData, "formdata");
  const res = await signup(formData);
  if (res.success) {
    setSnackbar({
      open: true,
      message: "Signup successful",
      severity: "success",
    });
    setTimeout(() => navigate("/login"), 1000);
  } else {
    setSnackbar({
      open: true,
      message: res.message || "Signup failed",
      severity: "error",
    });
  }
};


  return (
    <div
      style={{
        ...styles.container,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
    
      {!isMobile && (
        <div style={styles.leftPanel}>
          <div style={styles.overlay}>
            <h2 style={styles.overlayTitle}>Welcome Back!</h2>
            <p style={styles.overlayText}>
              To keep connected with us,
              <br /> please login with your personal info.
            </p>
            <button
              style={styles.btn}
              onClick={() => (window.location.href = "/login")}
            >
              SIGN IN
            </button>
          </div>
        </div>
      )}

      <div style={{ ...styles.rightPanel, width: isMobile ? "100%" : "50%" }}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Create an Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              style={styles.input}
            />
            {errors.name && (
              <span style={styles.error}>{errors.name.message}</span>
            )}

            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              style={styles.input}
            />
            {errors.email && (
              <span style={styles.error}>{errors.email.message}</span>
            )}

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              style={styles.input}
            />
            {errors.password && (
              <span style={styles.error}>{errors.password.message}</span>
            )}

            <button type="submit" style={styles.button}>
              SIGN UP
            </button>
          </form>
        </div>
      </div>
        <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  leftPanel: {
    width: "50%",
    backgroundColor: "#1e3a8a",

    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    textAlign: "center",
  },
  overlayTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  overlayText: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  btn: {
    padding: "12px 32px",
    backgroundColor: "#facc15",
    color: "#000",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
  },
  rightPanel: {
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  formBox: {
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#facc15",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "16px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "-10px",
    marginBottom: "5px",
  },
  button: {
    padding: "12px",
    width: "300px",
    backgroundColor: "#facc15",
    color: "#000",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    alignSelf: "center",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};
