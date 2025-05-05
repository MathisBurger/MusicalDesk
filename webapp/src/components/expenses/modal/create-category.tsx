import useForm from "@/form/useForm";
import useCreateCategoryMutation, {
  CreateCategoryRequest,
} from "@/hooks/mutations/expense/useCreateCategoryMutation";
import useAlert from "@/hooks/useAlert";
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

interface CreateCategoryModalProps {
  onClose: () => void;
}

const CreateCategoryModal = ({ onClose }: CreateCategoryModalProps) => {
  const { mutateAsync: createCategory, isPending } =
    useCreateCategoryMutation();
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<CreateCategoryRequest>({
    defaultValues: {
      name: "",
      hex_color: "",
      is_income: false,
    },
    labels: {
      name: "Name",
      hex_color: "Color",
      is_income: "Income category",
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
      content: "Cannot create account",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Create category</DialogTitle>
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

export default CreateCategoryModal;
