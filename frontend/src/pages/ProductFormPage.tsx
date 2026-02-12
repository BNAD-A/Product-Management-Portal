import { Box, Button, Paper, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type ProductFormValues = {
  name: string;
  description?: string;
  price: number;
  quantity: number;
};

type Props = {
  initialValues?: Partial<ProductFormValues>;
  submitLabel?: "save" | "create"; // pour traduire le bouton
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ProductFormPage({
  initialValues,
  submitLabel = "save",
  onSubmit,
  onCancel,
  loading = false,
}: Props) {
  const { t } = useTranslation();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [price, setPrice] = useState<number>(Number(initialValues?.price ?? 0));
  const [quantity, setQuantity] = useState<number>(Number(initialValues?.quantity ?? 0));

  const errors = useMemo(() => {
    const e: { name?: string; price?: string; quantity?: string } = {};
    if (!name.trim()) e.name = t("validation.required");
    else if (name.trim().length < 2) e.name = t("validation.minChars", { count: 2 });
    if (Number(price) < 0) e.price = t("validation.minValue", { min: 0 });
    if (Number(quantity) < 0) e.quantity = t("validation.minValue", { min: 0 });
    return e;
  }, [name, price, quantity, t]);

  const canSubmit = Object.keys(errors).length === 0 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim() ? description.trim() : "",
      price: Number(price),
      quantity: Number(quantity),
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 820 }}>
      <form onSubmit={handleSubmit}>
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
            {loading ? t("common.loading") : t(submitLabel === "create" ? "actions.create" : "actions.save")}
          </Button>

          <Button type="button" variant="outlined" onClick={onCancel}>
            {t("actions.cancel")}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}