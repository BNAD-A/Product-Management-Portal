import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { DELETE_USER, UPDATE_USER_ROLE, USERS_QUERY } from "../graphql/users";

type UserRow = { id: string; username: string; email: string; role: "ADMIN" | "USER" };

export default function AdminUsersPage() {
  const { data, loading, refetch } = useQuery(USERS_QUERY, { fetchPolicy: "cache-and-network" });
  const [updateRole, { loading: updating }] = useMutation(UPDATE_USER_ROLE);
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER);

  const users: UserRow[] = useMemo(() => data?.users ?? [], [data]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const onChangeRole = async (u: UserRow, role: "ADMIN" | "USER") => {
    try {
      await updateRole({ variables: { userId: u.id, role } });
      await refetch();
      // toast success
    } catch (e) {
      console.error(e);
      // toast error
    }
  };

  const onAskDelete = (u: UserRow) => {
    setSelectedUser(u);
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser({ variables: { userId: selectedUser.id } });
      setConfirmOpen(false);
      setSelectedUser(null);
      await refetch();
      // toast "User deleted"
    } catch (e) {
      console.error(e);
      // toast error
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5">Users (Admin)</Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={u.role}
                    onChange={(e) => onChangeRole(u, e.target.value as any)}
                    disabled={updating}
                  >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                  </Select>
                </TableCell>

                <TableCell align="right">
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => onAskDelete(u)}
                    disabled={deleting}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{selectedUser?.username}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={onConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
