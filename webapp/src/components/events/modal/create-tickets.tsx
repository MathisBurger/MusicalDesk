import useForm from "@/form/useForm";
import useCreateTicketsMutation, {
  CreateTicketsRequest,
} from "@/hooks/mutations/useCreateTicketsMutation";
import useAlert from "@/hooks/useAlert";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";

interface CreateTicketsModalProps {
  onClose: () => void;
  eventId: number;
}

const CreateTicketsModal = ({ onClose, eventId }: CreateTicketsModalProps) => {
  const { mutateAsync, isPending } = useCreateTicketsMutation(eventId);
  const { showAlert, displayAlert } = useAlert();

  const form = useForm<CreateTicketsRequest>({
    labels: {
      valid_until: "Valid until",
      quantity: "Quantity",
    },
    explicitTypes: {
      valid_until: "datetime-iso",
      quantity: "number",
    },
    required: ["valid_until", "quantity"],
  });

  const submit = async (data: CreateTicketsRequest) => {
    const res = await mutateAsync(data);
    if (res) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot create tickets for event",
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>Create ticket</DialogTitle>
        <DialogContent>
          {displayAlert()}
          <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
            {form.renderFormBody()}
            <DialogActions>
              <DialogActions>
                <Button type="submit" loading={isPending}>
                  Create
                </Button>
                <Button color="neutral" onClick={onClose}>
                  Cancel
                </Button>
              </DialogActions>
            </DialogActions>
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default CreateTicketsModal;
