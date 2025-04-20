"use client";
import EntityList, { EntityListRowAction } from "@/components/entity-list";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useBackendUsersQuery from "@/hooks/queries/user/useBackendUsersQuery";
import { UserRole } from "@/hooks/useCurrentUser";
import { Add } from "@mui/icons-material";
import {
  Button,
  Chip,
  CssVarsProvider,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BackendUsersPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const { data, isLoading } = useBackendUsersQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "username",
      headerName: "Username",
    },
    {
      field: "roles",
      headerName: "Roles",
      width: 250,
      renderCell: (props: GridRenderCellParams) => (
        <CssVarsProvider>
          <Stack direction="row" alignItems="center" spacing={1} height="100%">
            {(props.value ?? []).map((role: string) => (
              <Chip variant="soft" color="primary" key={role}>
                {role}
              </Chip>
            ))}
          </Stack>
        </CssVarsProvider>
      ),
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      color: "primary",
      onClick: (row) => router.push(`/backend/users/${row.id}`),
      name: "Details",
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Admin]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">Backend users</Typography>
          </Grid>
          <Grid>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Add />
              &nbsp; Create
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <EntityList
          columns={cols}
          rows={data ?? []}
          loading={isLoading}
          rowActions={rowActions}
        />
      </Stack>
    </RoleWrapper>
  );
};

export default BackendUsersPage;
