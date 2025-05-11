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

interface CreateBudgetModalProps {
  onClose: () => void;
}

const CreateBudgetModal = ({ onClose }: CreateBudgetModalProps) => {
  const { mutateAsync: createBudget, isPending } = useCreateBudgetMutation();
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<CreateBudgetRequest>({
    defaultValues: {
      name: "",
      category_id: -1,
      budget: 0,
    },
    labels: {
      name: "Name",
      category_id: "Category",
      start_date: "Startdate",
      end_date: "Enddate",
      budget: "Budget",
    },
    explicitTypes: {
      start_date: "datetime-iso",
      end_date: "datetime-iso",
    },
    required: ["name", "category_id", "start_date", "end_date", "budget"],
  });

  const submit = async (req: CreateBudgetRequest) => {
    const result = await createBudget(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot create budget",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Create budget</DialogTitle>
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

export default CreateBudgetModal;
