import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { PRODUCTS_QUERY } from "../graphql/queries";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: PRODUCTS_QUERY }],
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct({
      variables: {
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

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Create Product
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 720 }}>
        <form onSubmit={onSubmit}>
          <TextField
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "..." : "CREATE"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/products")}>
              CANCEL
            </Button>
          </Box>

          {error && (
            <Typography sx={{ mt: 2 }} color="error">
              Error: {error.message}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
}
