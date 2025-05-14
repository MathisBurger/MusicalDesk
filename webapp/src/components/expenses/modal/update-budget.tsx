import useForm from "@/form/useForm";
import useUpdateBudgetMutation from "@/hooks/mutations/expense/useUpdateBudgetMutation";
import useAlert from "@/hooks/useAlert";
import { Budget, UpdateBudgetRequest } from "@/types/api/expense";
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

interface UpdateBudgetModalProps {
  onClose: () => void;
  budget: Budget;
}

const UpdateBudgetModal = ({ onClose, budget }: UpdateBudgetModalProps) => {
  const { mutateAsync: updateBudget, isPending } = useUpdateBudgetMutation(
    budget.id,
  );
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<UpdateBudgetRequest>({
    defaultValues: {
      name: budget.name,
      budget: budget.budget / 100,
    },
    labels: {
      name: "Name",
      budget: "Budget",
    },
    required: ["name", "budget"],
    explicitTypes: {
      budget: "number",
    },
  });

  const submit = async (req: UpdateBudgetRequest) => {
    const result = await updateBudget({ ...req, budget: req.budget * 100 });
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot update budget",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Update budget</DialogTitle>
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

export default UpdateBudgetModal;
