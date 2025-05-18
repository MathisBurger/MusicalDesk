import useDenyExpenseMutation from "@/hooks/mutations/expense/useDenyExpenseMutation";
import useAlert from "@/hooks/useAlert";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Typography,
} from "@mui/joy";

interface DenyExpenseModalProps {
  onClose: () => void;
  expenseId: number;
}

const DenyExpenseModal = ({ onClose, expenseId }: DenyExpenseModalProps) => {
  const { displayAlert, showAlert } = useAlert();
  const { mutateAsync, isPending } = useDenyExpenseMutation(expenseId);

  const submit = async () => {
    const result = await mutateAsync();
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot deny expense",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <DialogTitle>Deny expense</DialogTitle>
        <DialogContent>
          {displayAlert()}
          <Typography>Do you really want to deny the expense?</Typography>
          <DialogActions>
            <Button onClick={submit} loading={isPending} color="danger">
              Deny
            </Button>
            <Button color="neutral" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default DenyExpenseModal;
