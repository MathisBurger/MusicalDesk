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
import { useTranslations } from "next-intl";

interface UpdateBudgetModalProps {
  onClose: () => void;
  budget: Budget;
}

const UpdateBudgetModal = ({ onClose, budget }: UpdateBudgetModalProps) => {
  const { mutateAsync: updateBudget, isPending } = useUpdateBudgetMutation(
    budget.id,
  );
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const form = useForm<UpdateBudgetRequest>({
    defaultValues: {
      name: budget.name,
      budget: budget.budget / 100,
    },
    labels: {
      name: t("labels.expense.budget.name"),
      budget: t("labels.expense.budget.budget"),
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
      content: t("messages.expense.cannotUpdateBudget"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.expense.updateBudget")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              {form.renderFormBody()}
              <DialogActions>
                <Button type="submit" loading={isPending}>
                  {t("generic.update")}
                </Button>
                <Button color="neutral" onClick={onClose}>
                  {t("generic.cancel")}
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
