"use client";
import EntityList, { EntityListRowAction } from "@/components/entity-list";
import CreateReportModal from "@/components/expenses/modal/create-report";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useReportsQuery from "@/hooks/queries/expense/useReportsQuery";
import { UserRole } from "@/types/api/user";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ExpenseReportsPage = () => {
  const t = useTranslations();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const { data, isLoading } = useReportsQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: t("generic.id"),
    },
    {
      field: "name",
      headerName: t("labels.expense.report.name"),
    },
    {
      field: "start_date",
      headerName: t("labels.expense.report.startDate"),
    },
    {
      field: "end_date",
      headerName: t("labels.expense.report.endDate"),
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: t("generic.details"),
      onClick: (row) => router.push(`/backend/expenses/reports/${row.id}`),
      color: "primary",
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.Accountant]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">{t("headings.reports")}</Typography>
          </Grid>
          <Grid>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Add />
              &nbsp; {t("generic.create")}
            </Button>
          </Grid>
        </Grid>
        <EntityList
          columns={cols}
          rows={data ?? []}
          loading={isLoading}
          rowActions={rowActions}
        />
      </Stack>
      {createModalOpen && (
        <CreateReportModal onClose={() => setCreateModalOpen(false)} />
      )}
    </RoleWrapper>
  );
};

export default ExpenseReportsPage;
