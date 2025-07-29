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
import { useTranslations } from "next-intl";

interface CreateBackendUserModal {
  onClose: () => void;
}

const CreateBackendUserModal = ({ onClose }: CreateBackendUserModal) => {
  const { mutateAsync, isPending } = useCreateBackendUserMutation();
  const { displayAlert, showAlert } = useAlert();
  const router = useRouter();
  const t = useTranslations();

  const submit = async (req: CreateBackendUserRequest) => {
    const result = await mutateAsync(req);
    if (result) {
      router.push(`/backend/users/${result.id}`);
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.user.cannotCreateBackendUser"),
      duration: 1500,
    });
  };

  const form = useForm<CreateBackendUserRequest>({
    defaultValues: {
      username: "",
      password: "",
      first_name: "",
      surname: "",
      function: "",
    },
    labels: {
      username: t("labels.user.username"),
      password: t("labels.user.password"),
      first_name: t("labels.user.firstName"),
      surname: t("labels.user.surname"),
      function: t("labels.user.function"),
      roles: t("labels.user.roles"),
    },
    required: [
      "username",
      "password",
      "roles",
      "first_name",
      "surname",
      "function",
    ],
    explicitTypes: {
      roles: "array",
      password: "password",
    },
  });

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>{t("modalTitles.user.createBackendUser")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              <Stack spacing={2}>
                <FormInput {...form.getInputProps("username")} />
                <FormInput {...form.getInputProps("password")} />
                <FormInput {...form.getInputProps("first_name")} />
                <FormInput {...form.getInputProps("surname")} />
                <FormInput {...form.getInputProps("function")} />
                <WrappedInput {...form.getInputProps("roles")}>
                  <RoleSelect
                    name={form.getInputProps("roles").name}
                    multiple
                  />
                </WrappedInput>
              </Stack>
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

export default CreateBackendUserModal;
