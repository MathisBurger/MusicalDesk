import useForm from "@/form/useForm";
import useCreateAccountMutation, {
  CreateAccountRequest,
} from "@/hooks/mutations/expense/useCreateAccountMutation";
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

interface CreateAccountModalProps {
  onClose: () => void;
}

const CreateAccountModal = ({ onClose }: CreateAccountModalProps) => {
  const { mutateAsync: createAccount, isPending } = useCreateAccountMutation();
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<CreateAccountRequest>({
    defaultValues: {
      name: "",
      owner_name: "",
      iban: "",
      is_tracking_account: false,
    },
    labels: {
      name: "Name",
      owner_name: "Name des Besitzers",
      iban: "IBAN",
      is_tracking_account: "Tracking Account?",
    },
    required: ["name", "owner_name", "iban"],
  });

  const submit = async (req: CreateAccountRequest) => {
    const result = await createAccount(req);
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
        <DialogTitle>Create account</DialogTitle>
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

export default CreateAccountModal;
