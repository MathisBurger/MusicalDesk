import useForm from "@/form/useForm";
import useCreateTicketsMutation from "@/hooks/mutations/event/useCreateTicketsMutation";
import useAlert from "@/hooks/useAlert";
import { CreateTicketsRequest } from "@/types/api/event";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { useTranslations } from "next-intl";

interface CreateTicketsModalProps {
  onClose: () => void;
  eventId: number;
}

const CreateTicketsModal = ({ onClose, eventId }: CreateTicketsModalProps) => {
  const { mutateAsync, isPending } = useCreateTicketsMutation(eventId);
  const { showAlert, displayAlert } = useAlert();
  const t = useTranslations();

  const form = useForm<CreateTicketsRequest>({
    labels: {
      valid_until: t("labels.events.ticket.validUntil"),
      quantity: t("labels.events.ticket.quantity"),
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
      content: t("messages.events.cannotCreateTickets"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>{t("modalTitles.events.createTicket")}</DialogTitle>
        <DialogContent>
          {displayAlert()}
          <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
            {form.renderFormBody()}
            <DialogActions>
              <DialogActions>
                <Button type="submit" loading={isPending}>
                  {t("generic.create")}
                </Button>
                <Button color="neutral" onClick={onClose}>
                  {t("generic.cancel")}
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
