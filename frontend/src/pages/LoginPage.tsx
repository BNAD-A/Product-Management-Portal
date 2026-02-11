import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutations";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setToken } from "../auth/token"; // ✅

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin1");
  const [password, setPassword] = useState("");

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await login({ variables: { username, password } });

    const token = res.data?.login?.token;

    if (token) {
      setToken(token);
      navigate("/products", { replace: true });
      return;
    }

    console.error("Login OK mais token absent:", res.data);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Login
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 520 }}>
        <form onSubmit={onSubmit}>
          <TextField
            label="Username"
            fullWidth
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "..." : "LOGIN"}
          </Button>

          {error && (
            <Typography sx={{ mt: 2 }} color="error">
              {error.message}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
}
