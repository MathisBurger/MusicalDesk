import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import WrappedInput from "@/form/wrapped-input";
import useCreateAccountMutation from "@/hooks/mutations/expense/useCreateAccountMutation";
import useAlert from "@/hooks/useAlert";
import { AccountType, CreateAccountRequest } from "@/types/api/expense";
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
import AccountTypeSelect from "../account-type-select";
import { useTranslations } from "next-intl";

interface CreateAccountModalProps {
  onClose: () => void;
}

const CreateAccountModal = ({ onClose }: CreateAccountModalProps) => {
  const { mutateAsync: createAccount, isPending } = useCreateAccountMutation();
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const form = useForm<CreateAccountRequest>({
    defaultValues: {
      name: "",
      owner_name: "",
      account_type: AccountType.FOREIGN,
      iban: "",
    },
    labels: {
      name: t("labels.expense.account.name"),
      owner_name: t("labels.expense.account.ownerName"),
      iban: t("labels.expense.account.iban"),
      account_type: t("labels.expense.account.type"),
    },
    required: ["name", "owner_name", "iban", "account_type"],
    explicitTypes: {
      iban: "string",
    },
    showFieldConditions: {
      iban: (row) =>
        row.account_type === AccountType.FOREIGN ||
        row.account_type === AccountType.MONEY,
    },
  });

  const submit = async (req: CreateAccountRequest) => {
    const result = await createAccount(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotCreateAccount"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.expense.createAccount")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              <WrappedInput {...form.getInputProps("account_type")}>
                <AccountTypeSelect {...form.getInputProps("account_type")} />
              </WrappedInput>
              <FormInput {...form.getInputProps("name")} />
              <FormInput {...form.getInputProps("owner_name")} />
              <FormInput {...form.getInputProps("iban")} />
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

export default CreateAccountModal;
