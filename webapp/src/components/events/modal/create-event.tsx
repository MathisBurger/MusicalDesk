import FormInput from "@/form/form-input";
import ImageUploadInput, { UploadFnResult } from "@/form/image-upload-input";
import useForm from "@/form/useForm";
import useCreateEventMutation from "@/hooks/mutations/event/useCreateEventMutation";
import useUploadFileMutation from "@/hooks/mutations/useUploadFileMutation";
import useAlert from "@/hooks/useAlert";
import { EventRequest } from "@/types/api/event";
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
import { useTranslations } from "next-intl";

interface CreateEventModalProps {
  onClose: () => void;
}

const CreateEventModal = ({ onClose }: CreateEventModalProps) => {
  const { mutateAsync: uploadFile } = useUploadFileMutation();
  const { mutateAsync: createEvent, isPending } = useCreateEventMutation();
  const t = useTranslations();

  const { displayAlert, showAlert } = useAlert();

  const uploadFn = async (
    name: string,
    file: File,
  ): Promise<UploadFnResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "meta",
      new Blob(
        [JSON.stringify({ name, private: false, required_roles: null })],
        { type: "application/json" },
      ),
    );
    const res = await uploadFile(formData);
    if (res) {
      return { imageId: res.id };
    }
    return { error: t("messages.events.cannotUploadFile") };
  };

  const submit = async (req: EventRequest) => {
    const result = await createEvent(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.events.cannotCreateEvent"),
      duration: 1500,
    });
  };

  const form = useForm<EventRequest>({
    labels: {
      name: t("labels.events.name"),
      price: t("labels.events.price"),
      tax_percentage: t("labels.events.tax"),
      image_id: t("labels.events.image"),
      event_date: t("labels.events.eventDate"),
      active_from: t("labels.events.activeFrom"),
      active_until: t("labels.events.activeUntil"),
      description: t("labels.events.description"),
      upper_reservation_limit: t("labels.events.upperReservationLimit"),
    },
    validation: {
      name: (v) => (v === "" ? t("validation.events.name") : null),
      price: (v) => (v === -1 ? t("validation.events.price") : null),
    },
    explicitTypes: {
      price: "number",
      tax_percentage: "number",
      image_id: "number",
      event_date: "datetime-iso",
      active_from: "datetime-iso",
      active_until: "datetime-iso",
      description: "textarea",
      upper_reservation_limit: "number",
    },
    required: ["name", "price", "tax_percentage", "image_id", "event_date"],
  });

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.events.createEvent")}</DialogTitle>
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
              <ImageUploadInput
                {...form.getInputProps("image_id")}
                uploadFn={uploadFn}
                accept="image/*"
              />
              <FormInput
                {...form.getInputProps("event_date")}
                type="datetime"
              />
              <FormInput {...form.getInputProps("description")} />
              <FormInput {...form.getInputProps("upper_reservation_limit")} />
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

export default CreateEventModal;
