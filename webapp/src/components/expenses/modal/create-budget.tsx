"use client";
import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import useCreateBudgetMutation from "@/hooks/mutations/expense/useCreateBudgetMutation";
import useAlert from "@/hooks/useAlert";
import { CreateBudgetRequest } from "@/types/api/expense";
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
import CategorySelect from "../category-select";
import { useTranslations } from "next-intl";

interface CreateBudgetModalProps {
  onClose: () => void;
}

const CreateBudgetModal = ({ onClose }: CreateBudgetModalProps) => {
  const { mutateAsync: createBudget, isPending } = useCreateBudgetMutation();
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const form = useForm<CreateBudgetRequest>({
    defaultValues: {
      name: "",
      category_id: -1,
      budget: 0,
    },
    labels: {
      name: t("labels.expense.budget.name"),
      category_id: t("labels.expense.budget.category"),
      start_date: t("labels.expense.budget.startDate"),
      end_date: t("labels.expense.budget.endDate"),
      budget: t("labels.expense.budget.budget"),
    },
    explicitTypes: {
      start_date: "datetime-iso",
      end_date: "datetime-iso",
    },
    required: ["name", "category_id", "start_date", "end_date", "budget"],
  });

  const submit = async (req: CreateBudgetRequest) => {
    const result = await createBudget({ ...req, budget: req.budget * 100 });
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotCreateBudget"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.expense.createBudget")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              <FormInput {...form.getInputProps("name")} />
              <CategorySelect {...form.getInputProps("category_id")} />
              <FormInput {...form.getInputProps("start_date")} />
              <FormInput {...form.getInputProps("end_date")} />
              <FormInput {...form.getInputProps("budget")} />
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

export default CreateBudgetModal;
