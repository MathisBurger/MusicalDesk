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
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const form = useForm<ExpenseRequest>({
    defaultValues: {
      name: "",
      description: "",
      total_amount: 0,
    },
    labels: {
      name: t("labels.expense.expense.name"),
      description: t("labels.expense.expense.description"),
      total_amount: t("labels.expense.expense.totalAmount"),
    },
    required: ["name", "description", "total_amount"],
    explicitTypes: {
      description: "textarea",
    },
  });

  const submit = async (req: ExpenseRequest) => {
    const result = await requestExpense({
      ...req,
      total_amount: req.total_amount * 100,
    });
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotRequestExpense"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.expense.requestExpense")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              {form.renderFormBody()}
              <DialogActions>
                <Button type="submit" loading={isPending}>
                  {t("generic.create")}
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

export default RequestExpenseModal;
