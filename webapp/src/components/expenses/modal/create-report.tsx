import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import useCreateReportMutation from "@/hooks/mutations/expense/useCreateReportMutation";
import useAlert from "@/hooks/useAlert";
import { CreateReportRequest } from "@/types/api/expense";
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

interface CreateReportModalProps {
  onClose: () => void;
}

const CreateReportModal = ({ onClose }: CreateReportModalProps) => {
  const { mutateAsync: createReport, isPending } = useCreateReportMutation();
  const { displayAlert, showAlert } = useAlert();

  const form = useForm<CreateReportRequest>({
    defaultValues: {
      name: "",
    },
    labels: {
      name: "Name",
      start_date: "Startdate",
      end_date: "Enddate",
    },
    explicitTypes: {
      start_date: "datetime-iso",
      end_date: "datetime-iso",
    },
    required: ["name", "start_date", "end_date"],
  });

  const submit = async (req: CreateReportRequest) => {
    const result = await createReport(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot create report",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Create report</DialogTitle>
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

export default CreateReportModal;
