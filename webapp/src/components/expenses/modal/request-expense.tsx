import useForm from "@/form/useForm";
import useAlert from "@/hooks/useAlert";
import { ExpenseRequest } from "@/types/api/expense";
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
import useRequestExpenseMutation from "@/hooks/mutations/expense/useRequestExpenseMutation";

interface RequestExpenseModalProps {
  onClose: () => void;
  pageSize: number;
}

const RequestExpenseModal = ({
  onClose,
  pageSize,
}: RequestExpenseModalProps) => {
  const { mutateAsync: requestExpense, isPending } =
    useRequestExpenseMutation(pageSize);
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<ExpenseRequest>({
    defaultValues: {
      name: "",
      description: "",
      total_amount: 0,
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
    const result = await requestExpense(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot request expense",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Request expense</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              {form.renderFormBody()}
              <DialogActions>
                <Button type="submit" loading={isPending}>
                  Create
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

export default RequestExpenseModal;
