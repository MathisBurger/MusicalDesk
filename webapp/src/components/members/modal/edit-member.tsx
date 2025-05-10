import FormInput from "@/form/form-input";
import { FormValue } from "@/form/types";
import useForm from "@/form/useForm";
import useEditMemberMutation from "@/hooks/mutations/membership/useEditMemberMutation";
import useAlert from "@/hooks/useAlert";
import { EditMemberRequest, Member } from "@/types/api/membership";
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

interface EditMemberModalProps {
  onClose: () => void;
  memberId: number;
  member: Member;
}

const EditMemberModal = ({
  onClose,
  memberId,
  member,
}: EditMemberModalProps) => {
  const { mutateAsync, isPending } = useEditMemberMutation(memberId);
  const { showAlert, displayAlert } = useAlert();
  const form = useForm<EditMemberRequest>({
    defaultValues: { ...member, id: undefined },
    labels: {
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      street: "Street",
      house_nr: "House nr.",
      zip: "Zip",
      city: "City",
      iban: "IBAN",
      membership_fee: "Membership fee",
    },
    validation: {
      iban: (v: FormValue) =>
        v === null || v === ""
          ? null
          : /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(
                (v as string).replace(/\s+/g, "").toUpperCase(),
              )
            ? null
            : "Invalid IBAN format",
    },
    required: ["first_name", "last_name"],
  });

  const onSubmit = async (values: EditMemberRequest) => {
    "use client";
    const result = await mutateAsync({ ...values, id: memberId });
    console.log(result);
    if (result !== null) {
      onClose();
    } else {
      showAlert({
        color: "danger",
        content: "Cannot update member",
      });
    }
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Update Member</DialogTitle>
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            {displayAlert()}
            <form onSubmit={form.onSubmit(onSubmit)}>
              <FormInput {...form.getInputProps("first_name")} />
              <FormInput {...form.getInputProps("last_name")} />
              <FormInput {...form.getInputProps("email")} />
              <Grid container direction="row" spacing={2}>
                <Grid xs={9}>
                  <FormInput {...form.getInputProps("street")} />
                </Grid>
                <Grid xs={3}>
                  <FormInput {...form.getInputProps("house_nr")} />
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={2}>
                <Grid xs={4}>
                  <FormInput {...form.getInputProps("zip")} />
                </Grid>
                <Grid xs={8}>
                  <FormInput {...form.getInputProps("city")} />
                </Grid>
              </Grid>
              <FormInput {...form.getInputProps("iban")} />
              <FormInput {...form.getInputProps("membership_fee")} />
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

export default EditMemberModal;
