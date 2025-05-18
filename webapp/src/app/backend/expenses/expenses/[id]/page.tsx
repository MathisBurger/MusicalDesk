"use client";
import BackButton from "@/components/back-button";
import ExpenseStatusChip from "@/components/expenses/expense-status-chip";
import UpdateExpenseModal from "@/components/expenses/modal/update-expense";
import TransactionsList from "@/components/expenses/transactions-list";
import UploadExpenseFileModal from "@/components/expenses/upload-expense-file";
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

const ExpensePage = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useCurrentUser();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [uploadFileModalOpen, setUploadFileModalOpen] =
    useState<boolean>(false);
  const { data, isLoading } = useExpenseQuery(parseInt(id, 10));

  const canUpdate =
    isGranted(currentUser, [UserRole.ExpenseRequestor]) &&
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
        title: "Name",
        value: data?.expense.name,
      },
      {
        title: "Status",
        value: data?.expense.status ? (
          <ExpenseStatusChip status={data.expense.status} />
        ) : null,
      },
      {
        title: "Description",
        value: data?.expense.description,
      },
      {
        title: "Total amount",
        value: `${(data?.expense.total_amount ?? 0) / 100}€`,
      },
    ],
    [data?.expense],
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
        {canUpdate && (
          <Card>
            <Stack direction="row" spacing={2}>
              {canUpdate && (
                <Button color="primary" onClick={() => setEditModalOpen(true)}>
                  Update
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
                <Typography level="h3">Images</Typography>
                {canUpdate && (
                  <Button
                    size="sm"
                    onClick={() => setUploadFileModalOpen(true)}
                  >
                    <Add /> &nbsp; Add
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
          <Grid xs={12}>
            <Card>
              <Typography level="h3">Transactions</Typography>
              <TransactionsList
                transactions={transactions}
                loading={isLoading}
                rowCount={transactions.length}
              />
            </Card>
          </Grid>
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
    </RoleWrapper>
  );
};

export default ExpensePage;
