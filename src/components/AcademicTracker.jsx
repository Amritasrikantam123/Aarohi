import React, { useState } from "react";

const BASE_URL = "https://aarohi-pr61.onrender.com";

export default function Registration({ onRegistrationSuccess, currentLang }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLoginMode
        ? `${BASE_URL}/api/auth/login`
        : `${BASE_URL}/api/auth/register`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Save token if needed
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert(isLoginMode ? "Login successful!" : "Registration successful!");

      // Send user back to app
      onRegistrationSuccess(data.user || formData);

    } catch (err) {
      console.error(err);
      setError("Backend error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>
        {isLoginMode
          ? "Login"
          : "Register"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isLoginMode
            ? "Login"
            : "Register"}
        </button>
      </form>

      <p
        onClick={() => setIsLoginMode(!isLoginMode)}
        style={{ cursor: "pointer", marginTop: "10px" }}
      >
        {isLoginMode
          ? "New user? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}