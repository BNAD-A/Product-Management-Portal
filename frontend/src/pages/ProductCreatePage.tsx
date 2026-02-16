import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { PRODUCTS_QUERY } from "../graphql/queries";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

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

  const [createProductMutation, { loading: saving }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      refetchQueries: [{ query: PRODUCTS_QUERY }],
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProductMutation({
        variables: {
          input: {
            name,
            description,
            price: Number(price),
            quantity: Number(quantity),
          },
        },
      });

      enqueueSnackbar(t("toast.productCreated"), { variant: "success" });
      navigate("/products");
    } catch (err) {
      enqueueSnackbar(t("toast.unknownError"), { variant: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {t("actions.create")}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 720 }}>
        <form onSubmit={onSubmit}>
          <TextField
            label={t("products.name")}
            fullWidth
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />

          <TextField
            label={t("products.description")}
            fullWidth
            sx={{ mb: 2 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label={t("products.price")}
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              disabled={saving}
            />
            <TextField
              label={t("products.quantity")}
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={saving}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={18} /> : undefined}
            >
              {saving ? t("common.loading") : t("actions.create")}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/products")}
              disabled={saving}
            >
              {t("actions.cancel")}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
