import FormInput from "@/form/form-input";
import ImageUploadInput, { UploadFnResult } from "@/form/image-upload-input";
import useForm from "@/form/useForm";
import { CreateEventRequest } from "@/hooks/mutations/useCreateEventMutation";
import useUploadFileMutation from "@/hooks/mutations/useUploadFileMutation";
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
              <FormInput {...form.getInputProps("name")} />
              <Grid container direction="row" spacing={2}>
                <Grid xs={8}>
                  <FormInput {...form.getInputProps("price")} />
                </Grid>
                <Grid xs={4}>
                  <FormInput {...form.getInputProps("tax_percentage")} />
                </Grid>
              </Grid>
              <ImageUploadInput
                {...form.getInputProps("image_id")}
                uploadFn={uploadFn}
                accept="image/*"
              />
              <FormInput {...form.getInputProps("event_date")} type="date" />
              <Grid container direction="row" spacing={2}>
                <Grid xs={6}>
                  <FormInput
                    {...form.getInputProps("active_from")}
                    type="date"
                  />
                </Grid>
                <Grid xs={6}>
                  <FormInput
                    {...form.getInputProps("active_until")}
                    type="date"
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
