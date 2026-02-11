import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { PRODUCT_BY_ID_QUERY } from "../graphql/queries";
import { UPDATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [updateProduct, { loading: saving, error: saveError }] = useMutation(UPDATE_PRODUCT_MUTATION);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProduct({
      variables: {
        id: productId,
        input: {
          name,
          description: description ? description : null,
          price: Number(price),
          quantity: Number(quantity),
        },
      },
    });
    navigate("/products");
  };

  if (!Number.isFinite(productId)) return <Typography color="error">Invalid id</Typography>;
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Edit Product #{productId}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 720 }}>
        <form onSubmit={onSubmit}>
          <TextField label="Name" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
          <TextField
            label="Description"
            fullWidth
            sx={{ mb: 2 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "..." : "SAVE"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/products")}>
              CANCEL
            </Button>
          </Box>

          {saveError && (
            <Typography sx={{ mt: 2 }} color="error">
              Error: {saveError.message}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
}
