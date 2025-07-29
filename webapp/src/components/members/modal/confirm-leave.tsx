"use client";
import useLeaveMemberMutation from "@/hooks/mutations/membership/useLeaveMemberMutation";
import useAlert from "@/hooks/useAlert";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { useTranslations } from "next-intl";

interface ConfirmLeaveModalProps {
  onClose: () => void;
  memberId: number;
}

const ConfirmLeaveModal = ({ onClose, memberId }: ConfirmLeaveModalProps) => {
  const { mutateAsync, isPending } = useLeaveMemberMutation(memberId);
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const leave = async () => {
    const result = await mutateAsync(memberId);
    if (result === null) {
      showAlert({
        duration: 1000,
        color: "danger",
        content: t("messages.member.cannotLeaveMember"),
      });
      return;
    }
    onClose();
  };

  return (
    <Modal onClose={onClose} open>
      <ModalDialog>
        <ModalClose />
        {displayAlert()}
        <DialogTitle>{t("modalTitles.member.confirmLeave")}</DialogTitle>
        <DialogContent>{t("messages.member.conformLeave")}</DialogContent>
        <DialogActions>
          <Button color="danger" loading={isPending} onClick={leave}>
            {t("actions.member.leave")}
          </Button>
          <Button color="neutral" onClick={onClose}>
            {t("generic.cancel")}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ConfirmLeaveModal;
