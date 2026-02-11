import { useMutation } from "@apollo/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { REGISTER_MUTATION } from "../graphql/users";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z.string().min(3, "Min 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Min 6 caractères"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await registerMutation({ variables: values });
      // toast success si tu as déjà un système de toast
      navigate("/login");
    } catch (e: any) {
      // toast error
      console.error(e);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4">Register</Typography>

        <TextField
          label="Username"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || loading}
        >
          {loading ? "Creating..." : "Create account"}
        </Button>

        <Button variant="text" onClick={() => navigate("/login")}>
          Back to login
        </Button>
      </Box>
    </Container>
  );
}
