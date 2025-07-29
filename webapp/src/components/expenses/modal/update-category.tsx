import useForm from "@/form/useForm";
import useUpdateCategoryMutation from "@/hooks/mutations/expense/useUpdateCategoryMutation";
import useAlert from "@/hooks/useAlert";
import { Category, UpdateCategoryRequest } from "@/types/api/expense";
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

interface UpdateCategoryModalProps {
  onClose: () => void;
  category: Category;
}

const UpdateCategoryModal = ({
  onClose,
  category,
}: UpdateCategoryModalProps) => {
  const { mutateAsync: updateCategory, isPending } = useUpdateCategoryMutation(
    category.id,
  );
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const form = useForm<UpdateCategoryRequest>({
    defaultValues: {
      name: category.name,
      hex_color: category.hex_color,
    },
    labels: {
      name: t("labels.expense.category.name"),
      hex_color: t("labels.expense.category.color"),
    },
    required: ["name", "hex_color"],
    explicitTypes: {
      hex_color: "color",
    },
  });

  const submit = async (req: UpdateCategoryRequest) => {
    const result = await updateCategory(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotUpdateCategory"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.expense.updateCategory")}</DialogTitle>
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

export default UpdateCategoryModal;
