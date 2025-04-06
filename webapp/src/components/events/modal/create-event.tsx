import useForm from "@/form/useForm";
import { CreateEventRequest } from "@/hooks/mutations/useCreateEventMutation";
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

interface CreateEventModalProps {
  onClose: () => void;
}

const CreateEventModal = ({ onClose }: CreateEventModalProps) => {
  const form = useForm<CreateEventRequest>({
    defaultValues: {
      name: "",
      price: 0,
      tax_percentage: 0,
      image_id: -1,
      event_date: new Date().toISOString(),
      active_from: new Date().toISOString(),
      active_until: new Date().toISOString(),
    },
    labels: {
      name: "Name",
      price: "Preis",
      tax_percentage: "Tax",
      image_id: "Image",
      event_date: "Date",
      active_from: "Active from",
      active_until: "Active until",
    },
    required: ["name", "price", "tax_percentage", "image_id", "event_date"],
  });

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Create event</DialogTitle>
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(async () => {})}>
              {form.renderFormBody()}
              <DialogActions>
                <Button type="submit" loading={false}>
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

export default CreateEventModal;
