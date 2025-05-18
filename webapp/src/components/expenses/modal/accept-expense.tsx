import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import WrappedInput from "@/form/wrapped-input";
import useAcceptExpenseMutation from "@/hooks/mutations/expense/useAcceptExpenseMutation";
import useAlert from "@/hooks/useAlert";
import { Expense } from "@/types/api/expense";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Typography,
} from "@mui/joy";
import AccountSelect from "../account-select";
import CategorySelect from "../category-select";

interface AcceptExpenseModalProps {
  onClose: () => void;
  expense: Expense;
}

interface FormType {
  ex_amount: number;
  ex_from_account_id: number;
  ex_to_account_id: number;
  ex_category_id?: number;
  bal_amount: number;
  bal_from_account_id: number;
  bal_to_account_id: number;
  bal_category_id?: number;
}

const AcceptExpenseModal = ({ onClose, expense }: AcceptExpenseModalProps) => {
  const { displayAlert, showAlert } = useAlert();
  const { mutateAsync, isPending } = useAcceptExpenseMutation(expense.id);

  const form = useForm<FormType>({
    defaultValues: {
      ex_amount: expense.total_amount / 100,
      bal_amount: expense.total_amount / 100,
    },
    labels: {
      ex_amount: "Amount (Expense transaction)",
      ex_from_account_id: "From account (Expense transaction)",
      ex_to_account_id: "To account (Expense transaction)",
      ex_category_id: "Category (Expense transaction)",
      bal_amount: "Amount (Balancing transaction)",
      bal_from_account_id: "From account (Balancing transaction)",
      bal_to_account_id: "To account (Balancing transaction)",
      bal_category_id: "Category (Balancing transaction)",
    },
    explicitTypes: {
      ex_from_account_id: "number",
      ex_to_account_id: "number",
      ex_category_id: "number",
      bal_from_account_id: "number",
      bal_to_account_id: "number",
      bal_category_id: "number",
    },
    required: [
      "ex_amount",
      "ex_from_account_id",
      "ex_to_account_id",
      "bal_amount",
      "bal_from_account_id",
      "bal_to_account_id",
    ],
  });

  const submit = async (data: FormType) => {
    const result = await mutateAsync({
      expense_transaction: {
        amount: data.ex_amount * 100,
        from_account_id: data.ex_from_account_id,
        to_account_id: data.ex_to_account_id,
        category_id: data.ex_category_id,
      },
      balancing_transaction: {
        amount: data.bal_amount * 100,
        from_account_id: data.bal_from_account_id,
        to_account_id: data.bal_to_account_id,
        category_id: data.bal_category_id,
      },
    });
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot accept expense",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <DialogTitle>Accept expense</DialogTitle>
        <DialogContent>
          {displayAlert()}
          <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
            <Typography level="h4">Expense transaction</Typography>
            <FormInput {...form.getInputProps("ex_amount")} />
            <AccountSelect {...form.getInputProps("ex_from_account_id")} />
            <AccountSelect {...form.getInputProps("ex_to_account_id")} />
            <CategorySelect {...form.getInputProps("ex_category_id")} />
            <Typography level="h4">Balancing transaction</Typography>
            <FormInput {...form.getInputProps("bal_amount")} />
            <AccountSelect {...form.getInputProps("bal_from_account_id")} />
            <AccountSelect {...form.getInputProps("bal_to_account_id")} />
            <CategorySelect {...form.getInputProps("bal_category_id")} />
            <DialogActions>
              <Button type="submit" loading={isPending} color="success">
                Accept
              </Button>
              <Button color="neutral" onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default AcceptExpenseModal;
