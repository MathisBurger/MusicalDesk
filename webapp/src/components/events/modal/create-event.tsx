import FormInput from "@/form/form-input";
import ImageUploadInput, { UploadFnResult } from "@/form/image-upload-input";
import { FormValue } from "@/form/types";
import useForm from "@/form/useForm";
import useCreateEventMutation, {
  CreateEventRequest,
} from "@/hooks/mutations/useCreateEventMutation";
import useUploadFileMutation from "@/hooks/mutations/useUploadFileMutation";
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
}

const CreateEventModal = ({ onClose }: CreateEventModalProps) => {
  const { mutateAsync: uploadFile } = useUploadFileMutation();
  const { mutateAsync: createEvent } = useCreateEventMutation();

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
    return { error: "Cannot upload file" };
  };

  const submit = async (req: CreateEventRequest) => {
    const result = await createEvent(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot create event",
      duration: 1500,
    });
  };

  const form = useForm<CreateEventRequest>({
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
        <DialogTitle>Create event</DialogTitle>
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
