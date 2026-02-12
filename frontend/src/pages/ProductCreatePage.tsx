import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { PRODUCTS_QUERY } from "../graphql/queries";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: PRODUCTS_QUERY }],
  });

  const errors = useMemo(() => {
    const e: { name?: string; price?: string; quantity?: string } = {};
    if (!name.trim()) e.name = t("validation.required");
    else if (name.trim().length < 2) e.name = t("validation.minChars", { count: 2 });
    if (Number(price) < 0) e.price = t("validation.minValue", { min: 0 });
    if (Number(quantity) < 0) e.quantity = t("validation.minValue", { min: 0 });
    return e;
  }, [name, price, quantity, t]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await createProduct({
        variables: {
          input: {
            name: name.trim(),
            description: description ? description : null,
            price: Number(price),
            quantity: Number(quantity),
          },
        },
      });

      enqueueSnackbar(t("toast.productCreated"), { variant: "success" });
      navigate("/products");
    } catch (err: any) {
      const msg = String(err?.message || "").toLowerCase();
      if (msg.includes("network") || msg.includes("failed to fetch"))
        enqueueSnackbar(t("toast.serverUnreachable"), { variant: "error" });
      else enqueueSnackbar(t("toast.unknownError"), { variant: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {t("actions.create")} {t("products.title").toLowerCase().slice(0, -1)}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 720 }}>
        <form onSubmit={onSubmit}>
          <TextField
            label={t("products.name")}
            fullWidth
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label={t("products.description")}
            fullWidth
            sx={{ mb: 2 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label={t("products.price")}
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              error={!!errors.price}
              helperText={errors.price}
            />
            <TextField
              label={t("products.quantity")}
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button type="submit" variant="contained" disabled={!canSubmit}>
              {loading ? t("common.loading") : t("actions.create")}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/products")}>
              {t("actions.cancel")}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}