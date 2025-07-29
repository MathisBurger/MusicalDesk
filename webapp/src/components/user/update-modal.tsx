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
import useUpdateBackendUserMutation from "@/hooks/mutations/user/useUpdateBackendUserMutation";
import { UpdateBackendUserRequest, User, UserRole } from "@/types/api/user";
import FormInput from "@/form/form-input";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const submit = async (req: UpdateBackendUserRequest) => {
    const result = await mutateAsync(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.user.cannotUpdateBackendUser"),
      duration: 1500,
    });
  };

  const form = useForm<UpdateBackendUserRequest>({
    defaultValues: {
      roles: user.roles,
      first_name: user.first_name,
      surname: user.surname,
      function: user.function,
    },
    labels: {
      roles: t("label.user.roles"),
      first_name: t("label.user.firstName"),
      surname: t("label.user.surname"),
      function: t("label.user.function"),
    },
    required: ["roles", "first_name", "surname", "function"],
  });

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>{t("modalTitles.user.updateBackendUser")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              <Stack spacing={2}>
                <FormInput {...form.getInputProps("first_name")} />
                <FormInput {...form.getInputProps("surname")} />
                <FormInput {...form.getInputProps("function")} />
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
                  {t("generic.update")}
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

export default UpdateBackendUserModal;
