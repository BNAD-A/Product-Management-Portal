import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Box, Button, Paper, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LOGIN_MUTATION } from "../graphql/mutations";
import { setToken } from "../auth/token";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState("admin1");
  const [password, setPassword] = useState("");

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ variables: { username, password } });
      const token = res.data?.login?.token;

      if (!token) {
        console.error("Login response without token:", res.data);
        return;
      }

      setToken(token);
      navigate("/products", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const errorMessage = (() => {
    if (!error) return null;
    const msg = error.message?.toLowerCase() || "";

    if (msg.includes("invalid credentials")) return t("auth.invalidCredentials");
    if (msg.includes("network") || msg.includes("failed to fetch"))
      return t("auth.serverUnreachable");

    return error.message;
  })();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {t("auth.loginTitle")}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 520 }}>
        <form onSubmit={onSubmit}>
          <TextField
            label={t("auth.username")}
            fullWidth
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <TextField
            label={t("auth.password")}
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Button type="submit" variant="contained" disabled={loading || !username || !password}>
            {loading ? t("common.loading") : t("auth.login")}
          </Button>

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
}