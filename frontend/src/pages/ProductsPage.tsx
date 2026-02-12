import { useMutation, useQuery } from "@apollo/client";
import { PRODUCTS_QUERY } from "../graphql/queries";
import { DELETE_PRODUCT_MUTATION } from "../graphql/mutations";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading, error, refetch } = useQuery(PRODUCTS_QUERY, {
    fetchPolicy: "network-only",
  });

  const [deleteProduct, { loading: deleting }] = useMutation(DELETE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: PRODUCTS_QUERY }],
  });

  const rows = useMemo(() => data?.products ?? [], [data]);

  // ✅ Dialog state (remplace window.confirm)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openDeleteDialog = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const closeDeleteDialog = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteProduct({ variables: { id: Number(selectedId) } });
      enqueueSnackbar(t("toast.productDeleted"), { variant: "success" });
      closeDeleteDialog();
    } catch (e: any) {
      const msg = String(e?.message || "").toLowerCase();
      if (msg.includes("unauthorized")) enqueueSnackbar(t("toast.invalidCredentials"), { variant: "error" });
      else if (msg.includes("network") || msg.includes("failed to fetch"))
        enqueueSnackbar(t("toast.serverUnreachable"), { variant: "error" });
      else enqueueSnackbar(t("toast.unknownError"), { variant: "error" });
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h3">{t("products.title")}</Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => refetch()}>
            {t("actions.refresh")}
          </Button>

          <Button variant="contained" onClick={() => navigate("/products/new")}>
            {t("actions.create")}
          </Button>
        </Box>
      </Box>

      {loading && <Typography>{t("common.loading")}</Typography>}

      {error && (
        <Typography color="error">
          {t("toast.productsLoadFail")} : {error.message}
        </Typography>
      )}

      {!loading && !error && (
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("products.name")}</TableCell>
                <TableCell>{t("products.price")}</TableCell>
                <TableCell>{t("products.quantity")}</TableCell>
                <TableCell align="right">{t("products.actions")}</TableCell>
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
                        {t("actions.edit")}
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        disabled={deleting}
                        onClick={() => openDeleteDialog(p.id)}
                      >
                        {t("actions.delete")}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>{t("products.empty")}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ✅ Dialog de confirmation traduit */}
      <Dialog open={confirmOpen} onClose={closeDeleteDialog}>
        <DialogTitle>{t("products.confirmDeletionTitle")}</DialogTitle>
        <DialogContent>{t("products.confirmDeletionMessage")}</DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>{t("actions.cancel")}</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleting}>
            {t("actions.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}