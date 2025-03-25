"use client";
import useCreateMemberMutation, {
  CreateMemberRequest,
} from "@/hooks/mutations/useCreateMemberMutation";
import useAlert from "@/hooks/useAlert";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

interface CreateMemberModalProps {
  onClose: () => void;
}

type FormElements = HTMLFormControlsCollection & CreateMemberRequest;

interface CreateMemberForm extends HTMLFormElement {
  readonly elements: FormElements;
}

const CreateMemberModal = ({ onClose }: CreateMemberModalProps) => {
  const { mutateAsync, isPending } = useCreateMemberMutation();
  const { showAlert, displayAlert } = useAlert();
  const router = useRouter();

  const onSubmit = async (e: FormEvent<CreateMemberForm>) => {
    "use client";
    e.preventDefault();
    const data: CreateMemberRequest = { ...e.currentTarget.elements };
    const result = await mutateAsync(data);
    if (result !== null) {
      router.push(`/backend/members/${result?.id}`);
    } else {
      showAlert({
        color: "danger",
        content: "Cannot create member",
      });
    }
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Create Member</DialogTitle>
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            {displayAlert()}
            <form onSubmit={onSubmit}>
              <FormControl required>
                <FormLabel>First name</FormLabel>
                <Input type="text" name="first_name" />
              </FormControl>
              <FormControl required>
                <FormLabel>Last name</FormLabel>
                <Input type="text" name="last_name" />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" />
              </FormControl>
              <Grid container direction="row" spacing={2}>
                <Grid xs={9}>
                  <FormControl>
                    <FormLabel>Street</FormLabel>
                    <Input type="text" name="street" fullWidth />
                  </FormControl>
                </Grid>
                <Grid xs={3}>
                  <FormControl>
                    <FormLabel>House nr</FormLabel>
                    <Input type="text" name="house_nr" />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={2}>
                <Grid xs={4}>
                  <FormControl>
                    <FormLabel>Zip</FormLabel>
                    <Input type="number" name="zip" />
                  </FormControl>
                </Grid>
                <Grid xs={8}>
                  <FormControl>
                    <FormLabel>City</FormLabel>
                    <Input type="text" name="city" />
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl>
                <FormLabel>IBAN</FormLabel>
                <Input type="text" name="iban" />
              </FormControl>
              <FormControl>
                <FormLabel>Membership fee</FormLabel>
                <Input type="number" name="membership_fee" />
              </FormControl>
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

export default CreateMemberModal;
