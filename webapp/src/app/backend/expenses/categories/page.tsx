"use client";
import EntityList, { EntityListRowAction } from "@/components/entity-list";
import CategoryChip from "@/components/expenses/category-chip";
import CreateCategoryModal from "@/components/expenses/modal/create-category";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useCategoriesQuery from "@/hooks/queries/expense/useCategoriesQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Category } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CategoriesPage = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const { data, isLoading } = useCategoriesQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "hex_color",
      headerName: "Color",
      renderCell: ({ row }) => <CategoryChip value={row as Category} />,
    },
    {
      field: "is_income",
      headerName: "Income category",
      width: 150,
      type: "boolean",
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: "Details",
      onClick: (row) => router.push(`/backend/expenses/categories/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">Categories</Typography>
          </Grid>
          {isGranted(currentUser, [UserRole.Accountant, UserRole.Admin]) && (
            <Grid>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Add />
                &nbsp; Create
              </Button>
            </Grid>
          )}
        </Grid>
        <EntityList
          columns={cols}
          rows={data ?? []}
          loading={isLoading}
          rowActions={rowActions}
        />
      </Stack>
      {createModalOpen && (
        <CreateCategoryModal onClose={() => setCreateModalOpen(false)} />
      )}
    </RoleWrapper>
  );
};

export default CategoriesPage;
