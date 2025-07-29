"use client";
import BackButton from "@/components/back-button";
import ExpenseStatusChip from "@/components/expenses/expense-status-chip";
import UpdateExpenseModal from "@/components/expenses/modal/update-expense";
import TransactionsList from "@/components/expenses/transactions-list";
import UploadExpenseFileModal from "@/components/expenses/modal/upload-expense-file";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useExpenseQuery from "@/hooks/queries/expense/useExpenseQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ExpenseStatus, Transaction } from "@/types/api/expense";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { openFile } from "@/utils/file";
import { Add } from "@mui/icons-material";
import {
  Button,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/joy";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import DenyExpenseModal from "@/components/expenses/modal/deny-expense";
import AcceptExpenseModal from "@/components/expenses/modal/accept-expense";
import { useTranslations } from "next-intl";

const ExpensePage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();
  const currentUser = useCurrentUser();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [uploadFileModalOpen, setUploadFileModalOpen] =
    useState<boolean>(false);
  const [denyModalOpen, setDenyModalOpen] = useState<boolean>(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState<boolean>(false);
  const { data, isLoading } = useExpenseQuery(parseInt(id, 10));

  const canUpdate =
    isGranted(currentUser, [UserRole.ExpenseRequestor]) &&
    data?.expense.status === ExpenseStatus.REQUEST;

  const canAcceptOrDeny =
    isGranted(currentUser, [UserRole.Accountant, UserRole.Admin]) &&
    data?.expense.status === ExpenseStatus.REQUEST;

  const transactions = useMemo<Transaction[]>(() => {
    const arr = [];
    if (data?.expense.expense_transaction) {
      arr.push(data.expense.expense_transaction);
    }
    if (data?.expense.balancing_transaction) {
      arr.push(data.expense.balancing_transaction);
    }
    return arr;
  }, [data?.expense]);

  const listData = useMemo<DisplayedData[]>(
    () => [
      {
        title: t("labels.expense.expense.name"),
        value: data?.expense.name,
      },
      {
        title: t("labels.expense.expense.status"),
        value: data?.expense.status ? (
          <ExpenseStatusChip status={data.expense.status} />
        ) : null,
      },
      {
        title: t("labels.expense.expense.description"),
        value: data?.expense.description,
      },
      {
        title: t("labels.expense.expense.totalAmount"),
        value: `${(data?.expense.total_amount ?? 0) / 100}€`,
      },
    ],
    [data?.expense, t],
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.Accountant, UserRole.ExpenseRequestor]}>
      <Stack spacing={2}>
        <BackButton /> &nbsp;
        <Typography level="h2">{data?.expense.name}</Typography>
        <Divider />
        {(canUpdate || canAcceptOrDeny) && (
          <Card>
            <Stack direction="row" spacing={2}>
              {canUpdate && (
                <Button color="primary" onClick={() => setEditModalOpen(true)}>
                  {t("generic.edit")}
                </Button>
              )}
              {canAcceptOrDeny && (
                <Button color="danger" onClick={() => setDenyModalOpen(true)}>
                  {t("actions.expense.deny")}
                </Button>
              )}
              {canAcceptOrDeny && (
                <Button
                  color="success"
                  onClick={() => setAcceptModalOpen(true)}
                >
                  {t("actions.expense.accept")}
                </Button>
              )}
            </Stack>
          </Card>
        )}
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Card>
              <KvList displayData={listData} />
            </Card>
          </Grid>
          <Grid xs={6}>
            <Card>
              <Stack direction="row" spacing={2}>
                <Typography level="h3">{t("headings.images")}</Typography>
                {canUpdate && (
                  <Button
                    size="sm"
                    onClick={() => setUploadFileModalOpen(true)}
                  >
                    <Add /> &nbsp; {t("generic.add")}
                  </Button>
                )}
              </Stack>
              <List size="md">
                {(data?.images ?? []).map((image) => (
                  <ListItem key={image.id} variant="outlined">
                    <ListItemButton onClick={() => openFile(image.id)}>
                      {image.name}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          {data?.expense.expense_transaction && (
            <Grid xs={12}>
              <Card>
                <Typography level="h3">{t("headings.transactions")}</Typography>
                <TransactionsList
                  transactions={transactions}
                  loading={isLoading}
                  rowCount={transactions.length}
                />
              </Card>
            </Grid>
          )}
        </Grid>
      </Stack>
      {editModalOpen && data?.expense && (
        <UpdateExpenseModal
          onClose={() => setEditModalOpen(false)}
          expense={data?.expense}
        />
      )}
      {uploadFileModalOpen && data?.expense.id && (
        <UploadExpenseFileModal
          onClose={() => setUploadFileModalOpen(false)}
          expenseId={data.expense.id}
        />
      )}
      {denyModalOpen && data?.expense.id && (
        <DenyExpenseModal
          onClose={() => setDenyModalOpen(false)}
          expenseId={data.expense.id}
        />
      )}
      {acceptModalOpen && data?.expense && (
        <AcceptExpenseModal
          onClose={() => setAcceptModalOpen(false)}
          expense={data.expense}
        />
      )}
    </RoleWrapper>
  );
};

export default ExpensePage;
