import { useMutation, useQuery } from "@apollo/client/react";
import { Box, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_PRODUCT_MUTATION } from "../graphql/mutations";
import { PRODUCT_BY_ID_QUERY, PRODUCTS_QUERY } from "../graphql/queries";
import ProductFormPage from "./ProductFormPage";

type ProductFormValues = {
  name: string;
  description?: string;
  price: number;
  quantity: number;
};

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

  const [updateProduct, { loading: saving }] = useMutation(UPDATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: PRODUCTS_QUERY }],
  });

  if (!Number.isFinite(productId)) return <Typography color="error">Invalid id</Typography>;
  if (loading) return <Typography>{t("common.loading")}</Typography>;
  if (error) return <Typography color="error">{error.message}</Typography>;

  const p = data?.productById;
  if (!p) return <Typography color="error">{t("toast.productNotFound")}</Typography>;

  const initialValues: Partial<ProductFormValues> = {
    name: p.name ?? "",
    description: p.description ?? "",
    price: Number(p.price ?? 0),
    quantity: Number(p.quantity ?? 0),
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await updateProduct({
        variables: {
          id: productId,
          input: {
            name: values.name.trim(),
            description: values.description?.trim() ? values.description.trim() : null,
            price: Number(values.price),
            quantity: Number(values.quantity),
          },
        },
      });

      enqueueSnackbar(t("toast.productUpdated"), { variant: "success" });
      navigate("/products");
    } catch (error: unknown) {
      console.error(error);
      enqueueSnackbar(t("toast.unknownError"), { variant: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {t("actions.edit")} #{productId}
      </Typography>

      <ProductFormPage
        key={productId} // ✅ remount si l'id change
        initialValues={initialValues}
        submitLabel="save"
        onSubmit={onSubmit}
        onCancel={() => navigate("/products")}
        loading={saving}
      />
    </Box>
  );
}
