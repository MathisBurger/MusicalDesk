import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
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
import RoleSelect from "../role-select";
import WrappedInput from "@/form/wrapped-input";
import useAlert from "@/hooks/useAlert";
import useUpdateBackendUserMutation, {
  UpdateBackendUserRequest,
} from "@/hooks/mutations/user/useUpdateBackendUserMutation";
import { User, UserRole } from "@/hooks/useCurrentUser";

interface UpdateBackendUserModalProps {
  onClose: () => void;
  user: User;
}

const UpdateBackendUserModal = ({
  onClose,
  user,
}: UpdateBackendUserModalProps) => {
  const { mutateAsync, isPending } = useUpdateBackendUserMutation(user.id);
  const { displayAlert, showAlert } = useAlert();

  const submit = async (req: UpdateBackendUserRequest) => {
    const result = await mutateAsync(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot update backend user",
      duration: 1500,
    });
  };

  const form = useForm<UpdateBackendUserRequest>({
    defaultValues: {
      roles: user.roles,
    },
    labels: {
      roles: "Roles",
    },
    required: ["roles"],
  });

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>Update backend user</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              <Stack spacing={2}>
                <WrappedInput {...form.getInputProps("roles")}>
                  <RoleSelect
                    defaultValue={
                      form.getInputProps("roles").defaultValue as UserRole[]
                    }
                    name={form.getInputProps("roles").name}
                    multiple
                  />
                </WrappedInput>
              </Stack>
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

export default UpdateBackendUserModal;
