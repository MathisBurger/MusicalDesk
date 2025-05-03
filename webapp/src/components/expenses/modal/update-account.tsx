import useForm from "@/form/useForm";
import useUpdateAccountMutation, {
  UpdateAccountRequest,
} from "@/hooks/mutations/expense/useUpdateAccountMutation";
import { Account } from "@/hooks/queries/expense/useAccountsQuery";
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

interface UpdateAccountModalProps {
  onClose: () => void;
  account: Account;
}

const UpdateAccountModal = ({ onClose, account }: UpdateAccountModalProps) => {
  const { mutateAsync: updateAccount, isPending } = useUpdateAccountMutation(
    account.id,
  );
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<UpdateAccountRequest>({
    defaultValues: {
      name: account.name,
      owner_name: account.owner_name,
      iban: account.iban,
    },
    labels: {
      name: "Name",
      owner_name: "Name des Besitzers",
      iban: "IBAN",
    },
    required: ["name", "owner_name", "iban"],
  });

  const submit = async (req: UpdateAccountRequest) => {
    const result = await updateAccount(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot update account",
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

export default UpdateAccountModal;
