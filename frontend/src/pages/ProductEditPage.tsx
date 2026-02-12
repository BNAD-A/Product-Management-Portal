import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { PRODUCT_BY_ID_QUERY } from "../graphql/queries";
import { UPDATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const productId = Number(id);

  const { data, loading, error } = useQuery(PRODUCT_BY_ID_QUERY, {
    variables: { id: productId },
    skip: !Number.isFinite(productId),
    fetchPolicy: "network-only",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    const p = data?.productById;
    if (!p) return;
    setName(p.name ?? "");
    setDescription(p.description ?? "");
    setPrice(Number(p.price ?? 0));
    setQuantity(Number(p.quantity ?? 0));
  }, [data]);

  const [updateProduct, { loading: saving }] = useMutation(UPDATE_PRODUCT_MUTATION);

  const errors = useMemo(() => {
    const e: { name?: string; price?: string; quantity?: string } = {};
    if (!name.trim()) e.name = t("validation.required");
    else if (name.trim().length < 2) e.name = t("validation.minChars", { count: 2 });
    if (Number(price) < 0) e.price = t("validation.minValue", { min: 0 });
    if (Number(quantity) < 0) e.quantity = t("validation.minValue", { min: 0 });
    return e;
  }, [name, price, quantity, t]);

  const canSubmit = Object.keys(errors).length === 0 && !saving;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await updateProduct({
        variables: {
          id: productId,
          input: {
            name: name.trim(),
            description: description ? description : null,
            price: Number(price),
            quantity: Number(quantity),
          },
        },
      });

      enqueueSnackbar(t("toast.productUpdated"), { variant: "success" });
      navigate("/products");
    } catch (err: any) {
      enqueueSnackbar(t("toast.unknownError"), { variant: "error" });
      console.error(err);
    }
  };

  if (!Number.isFinite(productId)) return <Typography color="error">Invalid id</Typography>;
  if (loading) return <Typography>{t("common.loading")}</Typography>;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {t("actions.edit")} #{productId}
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
              {saving ? t("common.loading") : t("actions.save")}
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