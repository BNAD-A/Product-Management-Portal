// src/pages/ProductsListPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ME_QUERY, PRODUCTS_QUERY, DELETE_PRODUCT } from "../graphql/operations";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
};

export default function ProductsListPage() {
  const nav = useNavigate();
  const { data: meData } = useQuery(ME_QUERY);
  const isAdmin = meData?.me?.role === "ADMIN";

  const { data, loading, error, refetch } = useQuery(PRODUCTS_QUERY);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const products: Product[] = data?.products ?? [];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const openDelete = (id: string) => {
    setToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await deleteProduct({ variables: { id: Number(toDelete) } });
    setConfirmOpen(false);
    setToDelete(null);
    await refetch();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h3">Products</Typography>

        <Button variant="contained" onClick={() => nav("/products/new")}>
          Create
        </Button>
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Failed to load products</Typography>}

      {!loading && !error && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => nav(`/products/${p.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled={!isAdmin}
                      onClick={() => openDelete(p.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No products</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* US-10.4 Confirm deletion dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this product?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={!isAdmin}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
