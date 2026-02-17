import { useMutation } from "@apollo/client/react";
import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { setToken } from "../auth/authStorage";
import { LOGIN_MUTATION } from "../graphql/mutations";

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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.default",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 520 }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          {t("auth.loginTitle")}
        </Typography>

        <Paper sx={{ p: 4 }}>
          <form onSubmit={onSubmit}>
            <TextField
              label={t("auth.username")}
              fullWidth
              sx={{ mb: 2 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />

            <TextField
              label={t("auth.password")}
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !username || !password}
              startIcon={loading ? <CircularProgress size={18} /> : undefined}
            >
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
    </Box>
  );

}
