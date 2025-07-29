import useForm from "@/form/useForm";
import useCreateCategoryMutation from "@/hooks/mutations/expense/useCreateCategoryMutation";
import useAlert from "@/hooks/useAlert";
import { CreateCategoryRequest } from "@/types/api/expense";
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

interface CreateCategoryModalProps {
  onClose: () => void;
}

const CreateCategoryModal = ({ onClose }: CreateCategoryModalProps) => {
  const { mutateAsync: createCategory, isPending } =
    useCreateCategoryMutation();
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const form = useForm<CreateCategoryRequest>({
    defaultValues: {
      name: "",
      hex_color: "",
      is_income: false,
    },
    labels: {
      name: t("labels.expense.category.name"),
      hex_color: t("labels.expense.category.color"),
      is_income: t("labels.expense.category.isIncome"),
    },
    required: ["name", "hex_color"],
    explicitTypes: {
      hex_color: "color",
    },
  });

  const submit = async (req: CreateCategoryRequest) => {
    const result = await createCategory(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotCreateCategory"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.expense.createCategory")}</DialogTitle>
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

export default CreateCategoryModal;
