import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import useCreateBackendUserMutation from "@/hooks/mutations/user/useCreateBackendUserMutation";
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
import { useRouter } from "next/navigation";
import { CreateBackendUserRequest } from "@/types/api/user";

interface CreateBackendUserModal {
  onClose: () => void;
}

const CreateBackendUserModal = ({ onClose }: CreateBackendUserModal) => {
  const { mutateAsync, isPending } = useCreateBackendUserMutation();
  const { displayAlert, showAlert } = useAlert();
  const router = useRouter();

  const submit = async (req: CreateBackendUserRequest) => {
    const result = await mutateAsync(req);
    if (result) {
      router.push(`/backend/users/${result.id}`);
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: "Cannot create backend user",
      duration: 1500,
    });
  };

  const form = useForm<CreateBackendUserRequest>({
    defaultValues: {
      username: "",
      password: "",
    },
    labels: {
      username: "Username",
      password: "Password",
      roles: "Roles",
    },
    required: ["username", "password", "roles"],
    explicitTypes: {
      roles: "array",
      password: "password",
    },
  });

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>Create backend user</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              <Stack spacing={2}>
                <FormInput {...form.getInputProps("username")} />
                <FormInput {...form.getInputProps("password")} />
                <WrappedInput {...form.getInputProps("roles")}>
                  <RoleSelect
                    name={form.getInputProps("roles").name}
                    multiple
                  />
                </WrappedInput>
              </Stack>
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

export default CreateBackendUserModal;
