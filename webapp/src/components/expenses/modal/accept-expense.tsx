import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import WrappedInput from "@/form/wrapped-input";
import useAcceptExpenseMutation from "@/hooks/mutations/expense/useAcceptExpenseMutation";
import useAlert from "@/hooks/useAlert";
import {
  AcceptExpenseRequest,
  AccountType,
  Expense,
} from "@/types/api/expense";
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

const AcceptExpenseModal = ({ onClose, expense }: AcceptExpenseModalProps) => {
  const { displayAlert, showAlert } = useAlert();
  const { mutateAsync, isPending } = useAcceptExpenseMutation(expense.id);

  const form = useForm<AcceptExpenseRequest>({
    defaultValues: {
      amount: expense.total_amount / 100,
    },
    labels: {
      amount: "Amount",
      from_account_id: "From account (Foreign account)",
      to_account_id: "To account (Material account)",
      money_account_id: "Money account (Account the payment will come from)",
      category_id: "Category",
    },
    explicitTypes: {
      money_account_id: "number",
      from_account_id: "number",
      to_account_id: "number",
      category_id: "number",
    },
    required: [
      "amount",
      "from_account_id",
      "to_account_id",
      "money_account_id",
    ],
  });

  const submit = async (data: AcceptExpenseRequest) => {
    const result = await mutateAsync({
      ...data,
      amount: data.amount * 100,
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
            <FormInput {...form.getInputProps("amount")} />
            <AccountSelect
              {...form.getInputProps("from_account_id")}
              accountType={AccountType.FOREIGN}
            />
            <AccountSelect
              {...form.getInputProps("to_account_id")}
              accountType={AccountType.MATERIAL}
            />
            <AccountSelect
              {...form.getInputProps("money_account_id")}
              accountType={AccountType.MONEY}
            />
            <CategorySelect {...form.getInputProps("category_id")} />
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
