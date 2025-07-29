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
import { useTranslations } from "next-intl";

interface DenyExpenseModalProps {
  onClose: () => void;
  expenseId: number;
}

const DenyExpenseModal = ({ onClose, expenseId }: DenyExpenseModalProps) => {
  const { displayAlert, showAlert } = useAlert();
  const { mutateAsync, isPending } = useDenyExpenseMutation(expenseId);
  const t = useTranslations();

  const submit = async () => {
    const result = await mutateAsync();
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotDenyExpense"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <DialogTitle>{t("modalTitles.expense.denyExpense")}</DialogTitle>
        <DialogContent>
          {displayAlert()}
          <Typography>{t("messages.expense.reallyWantToDeny")}</Typography>
          <DialogActions>
            <Button onClick={submit} loading={isPending} color="danger">
              {t("actions.expense.deny")}
            </Button>
            <Button color="neutral" onClick={onClose}>
              {t("generic.cancel")}
            </Button>
          </DialogActions>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default DenyExpenseModal;
