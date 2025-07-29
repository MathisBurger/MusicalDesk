import useForm from "@/form/useForm";
import useUpdateAccountMutation from "@/hooks/mutations/expense/useUpdateAccountMutation";
import useAlert from "@/hooks/useAlert";
import {
  Account,
  AccountType,
  UpdateAccountRequest,
} from "@/types/api/expense";
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

interface UpdateAccountModalProps {
  onClose: () => void;
  account: Account;
}

const UpdateAccountModal = ({ onClose, account }: UpdateAccountModalProps) => {
  const { mutateAsync: updateAccount, isPending } = useUpdateAccountMutation(
    account.id,
  );
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const form = useForm<UpdateAccountRequest>({
    defaultValues: {
      name: account.name,
      owner_name: account.owner_name,
      iban: account.iban,
    },
    labels: {
      name: t("labels.expense.account.name"),
      owner_name: t("labels.expense.account.ownerName"),
      iban: t("labels.expense.account.iban"),
    },
    required: ["name", "owner_name", "iban"],
    showFieldConditions: {
      iban: () =>
        account.account_type === AccountType.MONEY ||
        account.account_type === AccountType.FOREIGN,
    },
  });

  const submit = async (req: UpdateAccountRequest) => {
    const result = await updateAccount(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotUpdateAccount"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.expense.updateAccount")}</DialogTitle>
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

export default UpdateAccountModal;
