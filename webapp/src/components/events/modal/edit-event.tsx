import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import { EventRequest } from "@/hooks/mutations/useCreateEventMutation";
import useUpdateEventMutation from "@/hooks/mutations/useUpdateEventMutation";
import { Event } from "@/hooks/queries/useEventsQuery";
import useAlert from "@/hooks/useAlert";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";

interface CreateEventModalProps {
  onClose: () => void;
  event: Event;
}

const EditEventModal = ({ onClose, event }: CreateEventModalProps) => {
  const { mutateAsync: updateEvent, isPending } = useUpdateEventMutation(
    event.id,
  );

  const { displayAlert, showAlert } = useAlert();

  const submit = async (req: EventRequest) => {
    const result = await updateEvent(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot update event",
      duration: 1500,
    });
  };

  const form = useForm<EventRequest>({
    defaultValues: {
      ...event,
      id: undefined,
      event_date: new Date(event.event_date),
      active_from: event.active_from ? new Date(event.active_from) : null,
      active_until: event.active_until ? new Date(event.active_until) : null,
    },
    labels: {
      name: "Name",
      price: "Price",
      tax_percentage: "Tax",
      image_id: "Image",
      event_date: "Date",
      active_from: "Active from",
      active_until: "Active until",
    },
    validation: {
      name: (v) => (v === "" ? "Please choose an valid name" : null),
      price: (v) => (v === -1 ? "Please choose an valid value" : null),
    },
    explicitTypes: {
      price: "number",
      tax_percentage: "number",
      image_id: "number",
      event_date: "datetime-iso",
      active_from: "datetime-iso",
      active_until: "datetime-iso",
    },
    required: ["name", "price", "tax_percentage", "image_id", "event_date"],
  });

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Update event</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              <FormInput {...form.getInputProps("name")} />
              <Grid container direction="row" spacing={2}>
                <Grid xs={8}>
                  <FormInput
                    {...form.getInputProps("price")}
                    endDecorator="€"
                  />
                </Grid>
                <Grid xs={4}>
                  <FormInput
                    {...form.getInputProps("tax_percentage")}
                    endDecorator="%"
                  />
                </Grid>
              </Grid>
              <FormInput {...form.getInputProps("image_id")} disabled />
              <FormInput
                {...form.getInputProps("event_date")}
                type="datetime"
              />
              <Grid container direction="row" spacing={2}>
                <Grid xs={6}>
                  <FormInput
                    {...form.getInputProps("active_from")}
                    type="datetime"
                  />
                </Grid>
                <Grid xs={6}>
                  <FormInput
                    {...form.getInputProps("active_until")}
                    type="datetime"
                  />
                </Grid>
              </Grid>
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

export default EditEventModal;
