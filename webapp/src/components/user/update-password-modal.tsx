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
import useAlert from "@/hooks/useAlert";
import useUpdateBackendUserPasswordMutation from "@/hooks/mutations/user/useUpdateBackendUserPasswordMutation";
import { UpdateBackendUserPasswordRequest, User } from "@/types/api/user";
import { useTranslations } from "next-intl";

interface UpdateBackendUserPasswordModalProps {
  onClose: () => void;
  user: User;
}

const UpdateBackendUserPasswordModal = ({
  onClose,
  user,
}: UpdateBackendUserPasswordModalProps) => {
  const { mutateAsync, isPending } = useUpdateBackendUserPasswordMutation(
    user.id,
  );
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const submit = async (req: UpdateBackendUserPasswordRequest) => {
    const result = await mutateAsync(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.user.cannotUpdateBackendUserPassword"),
      duration: 1500,
    });
  };

  const form = useForm<UpdateBackendUserPasswordRequest>({
    labels: {
      password: t("labels.user.password"),
    },
    required: ["password"],
    explicitTypes: {
      password: "password",
    },
  });

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>{t("modalTitles.user.updateUserPassword")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              {form.renderFormBody()}
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

export default UpdateBackendUserPasswordModal;
