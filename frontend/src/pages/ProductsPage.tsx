import { useMutation, useQuery } from "@apollo/client";
import { PRODUCTS_QUERY } from "../graphql/queries";
import { DELETE_PRODUCT_MUTATION } from "../graphql/mutations";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(PRODUCTS_QUERY, {
    fetchPolicy: "network-only",
  });

  const [deleteProduct, { loading: deleting }] = useMutation(DELETE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: PRODUCTS_QUERY }],
  });

  const rows = data?.products ?? [];

  const onDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct({ variables: { id: Number(id) } });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h3">Products</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => refetch()}>
            REFRESH
          </Button>
          <Button variant="contained" onClick={() => navigate("/products/new")}>
            CREATE
          </Button>
        </Box>
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}

      {!loading && !error && (
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "inline-flex", gap: 1 }}>
                      <Button variant="outlined" onClick={() => navigate(`/products/${p.id}/edit`)}>
                        EDIT
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        disabled={deleting}
                        onClick={() => onDelete(p.id)}
                      >
                        DELETE
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
