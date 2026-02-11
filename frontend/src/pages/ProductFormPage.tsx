// src/pages/ProductFormPage.tsx
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { CREATE_PRODUCT, UPDATE_PRODUCT, PRODUCT_BY_ID } from "../graphql/operations";

export default function ProductFormPage() {
  const nav = useNavigate();
  const params = useParams();
  const isEdit = Boolean(params.id);
  const idNum = useMemo(() => (params.id ? Number(params.id) : null), [params.id]);

  const { data, loading } = useQuery(PRODUCT_BY_ID, {
    variables: { id: idNum ?? 0 },
    skip: !isEdit || !idNum,
  });

  const [createProduct, { loading: creating, error: createErr }] = useMutation(CREATE_PRODUCT);
  const [updateProduct, { loading: updating, error: updateErr }] = useMutation(UPDATE_PRODUCT);

  // simple state (US-10.x du PDF parle react-hook-form; on fera ça juste après si tu veux)
  const [form, setForm] = (function () {
    // petit hack pour éviter de te multiplier les fichiers maintenant
    const React = require("react") as typeof import("react");
    return React.useState({ name: "", description: "", price: 0, quantity: 0 }) as any;
  })();

  useEffect(() => {
    if (isEdit && data?.productById) {
      const p = data.productById;
      setForm({
        name: p.name ?? "",
        description: p.description ?? "",
        price: Number(p.price ?? 0),
        quantity: Number(p.quantity ?? 0),
      });
    }
  }, [isEdit, data, setForm]);

  const save = async () => {
    // validations mini (le backend valide déjà; on mettra zod ensuite)
    if (!form.name || form.name.trim().length < 2) return;

    if (!isEdit) {
      await createProduct({
        variables: {
          input: {
            name: form.name,
            description: form.description || null,
            price: Number(form.price),
            quantity: Number(form.quantity),
          },
        },
      });
      nav("/products");
      return;
    }

    await updateProduct({
      variables: {
        id: idNum,
        input: {
          name: form.name,
          description: form.description || null,
          price: Number(form.price),
          quantity: Number(form.quantity),
        },
      },
    });
    nav("/products");
  };

  if (isEdit && loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {isEdit ? "Edit Product" : "Create Product"}
      </Typography>

      <Paper sx={{ p: 2, maxWidth: 520 }}>
        <TextField
          label="Name"
          fullWidth
          sx={{ mb: 2 }}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          sx={{ mb: 2 }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <TextField
          label="Quantity"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => nav("/products")}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={creating || updating || form.name.trim().length < 2}
          >
            Save
          </Button>
        </Box>

        {(createErr || updateErr) && (
          <Typography color="error" sx={{ mt: 2 }}>
            {createErr?.message || updateErr?.message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
