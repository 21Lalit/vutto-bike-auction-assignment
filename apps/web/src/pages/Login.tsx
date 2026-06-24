import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function Login() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      mode === "login" ? await login(form.email, form.password) : await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  return (
    <main className="authPage">
      <form className="authBox" onSubmit={submit}>
        <h1>{mode === "login" ? "Login" : "Create account"}</h1>
        {mode === "register" && <label>Name<input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}
        <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <div className="alert error">{error}</div>}
        <button className="button full">{mode === "login" ? "Login" : "Register"}</button>
        <button type="button" className="linkButton" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Need an account?" : "Already registered?"}</button>
      </form>
    </main>
  );
}
