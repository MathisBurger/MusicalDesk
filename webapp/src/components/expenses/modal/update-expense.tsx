import useForm from "@/form/useForm";
import useUpdateExpenseMutation from "@/hooks/mutations/expense/useUpdateExpenseMutation";
import useAlert from "@/hooks/useAlert";
import { Expense, ExpenseRequest } from "@/types/api/expense";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";

interface UpdateExpenseModalProps {
  onClose: () => void;
  expense: Expense;
}

const UpdateExpenseModal = ({ onClose, expense }: UpdateExpenseModalProps) => {
  const { mutateAsync: updateExpense, isPending } = useUpdateExpenseMutation(
    expense.id,
  );
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<ExpenseRequest>({
    defaultValues: {
      name: expense.name,
      description: expense.description,
      total_amount: expense.total_amount / 100,
    },
    labels: {
      name: "Name",
      description: "Description",
      total_amount: "Total amount in €",
    },
    required: ["name", "description", "total_amount"],
    explicitTypes: {
      description: "textarea",
    },
  });

  const submit = async (req: ExpenseRequest) => {
    const result = await updateExpense({
      ...req,
      total_amount: req.total_amount * 100,
    });
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot update expense",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Update expense</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              {form.renderFormBody()}
              <DialogActions>
                <Button type="submit" loading={isPending}>
                  Update
                </Button>
                <Button color="neutral" onClick={onClose}>
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default UpdateExpenseModal;
