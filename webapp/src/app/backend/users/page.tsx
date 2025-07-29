"use client";
import EntityList, { EntityListRowAction } from "@/components/entity-list";
import CreateBackendUserModal from "@/components/user/create-modal";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useBackendUsersQuery from "@/hooks/queries/user/useBackendUsersQuery";
import { UserRole } from "@/types/api/user";
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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BackendUsersPage = () => {
  const t = useTranslations();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const { data, isLoading } = useBackendUsersQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: t("generic.id"),
    },
    {
      field: "username",
      headerName: t("labels.user.username"),
    },
    {
      field: "first_name",
      headerName: t("labels.user.firstName"),
    },
    {
      field: "surname",
      headerName: t("labels.user.surname"),
    },
    {
      field: "roles",
      headerName: t("labels.user.roles"),
      width: 250,
      renderCell: (props: GridRenderCellParams) => (
        <CssVarsProvider>
          <Stack direction="row" alignItems="center" spacing={1} height="100%">
            {(props.value ?? []).map((role: string) => (
              <Chip variant="soft" color="primary" key={role}>
                {t(`roles.${role}`)}
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
      name: t("generic.details"),
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Admin]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">{t("headings.backendUsers")}</Typography>
          </Grid>
          <Grid>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Add />
              &nbsp; {t("generic.create")}
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
      {createModalOpen && (
        <CreateBackendUserModal onClose={() => setCreateModalOpen(false)} />
      )}
    </RoleWrapper>
  );
};

export default BackendUsersPage;
