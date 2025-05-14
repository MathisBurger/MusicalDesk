import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import useCreateTransactionMutation from "@/hooks/mutations/expense/useCreateTransactionMutation";
import useAlert from "@/hooks/useAlert";
import { CreateTransactionRequest } from "@/types/api/expense";
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
import AccountSelect from "../account-select";

interface CreateTransactionModalProps {
  onClose: () => void;
  pageSize: number;
}

const CreateTransactionModal = ({
  onClose,
  pageSize,
}: CreateTransactionModalProps) => {
  const { mutateAsync: createTransaction, isPending } =
    useCreateTransactionMutation(pageSize);
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<CreateTransactionRequest>({
    defaultValues: {
      name: "",
      amount: 0.0,
      from_account_id: -1,
      to_account_id: -1,
      is_money_transaction: true,
    },
    labels: {
      name: "Name",
      amount: "Amount",
      from_account_id: "Account (From)",
      to_account_id: "Account (To)",
      category_id: "Category",
      is_money_transaction: "Money transaction?",
    },
    required: ["name", "amount", "from_account_id", "to_account_id"],
    explicitTypes: {
      category_id: "number",
    },
  });

  const submit = async (req: CreateTransactionRequest) => {
    const result = await createTransaction(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot create transaction",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Create transaction</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              <FormInput {...form.getInputProps("name")} />
              <FormInput {...form.getInputProps("amount")} endDecorator="€" />
              <AccountSelect {...form.getInputProps("from_account_id")} />
              <AccountSelect {...form.getInputProps("to_account_id")} />
              <CategorySelect {...form.getInputProps("category_id")} />
              <FormInput {...form.getInputProps("is_money_transaction")} />
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

export default CreateTransactionModal;
