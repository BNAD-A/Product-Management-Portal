import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { REGISTER_MUTATION } from "../graphql/users";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const schema = useMemo(
    () =>
      z.object({
        username: z.string().min(3, t("validation.minChars", { count: 3 })),
        email: z.string().email(t("validation.emailInvalid")),
        password: z.string().min(6, t("validation.minChars", { count: 6 })),
      }),
    [t]
  );

  type FormValues = z.infer<typeof schema>;

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
      enqueueSnackbar(t("toast.registerSuccess"), { variant: "success" });
      navigate("/login");
    } catch (e: any) {
      enqueueSnackbar(t("toast.unknownError"), { variant: "error" });
      console.error(e);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4">{t("register.title")}</Typography>

        <TextField
          label={t("auth.username")}
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
          label={t("auth.password")}
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={!isValid || loading}>
          {loading ? t("register.creating") : t("register.createAccount")}
        </Button>

        <Button variant="text" onClick={() => navigate("/login")}>
          {t("register.backToLogin")}
        </Button>
      </Box>
    </Container>
  );
}