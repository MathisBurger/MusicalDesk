"use client";
import useLeaveMemberMutation from "@/hooks/mutations/useLeaveMemberMutation";
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

interface ConfirmLeaveModalProps {
  onClose: () => void;
  memberId: number;
}

const ConfirmLeaveModal = ({ onClose, memberId }: ConfirmLeaveModalProps) => {
  const { mutateAsync, isPending } = useLeaveMemberMutation(memberId);
  const { displayAlert, showAlert } = useAlert();

  const leave = async () => {
    const result = await mutateAsync(memberId);
    if (result === null) {
      showAlert({
        duration: 1000,
        color: "danger",
        content: "Cannot leave user",
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
        <DialogTitle>Confirm leave</DialogTitle>
        <DialogContent>Confirm that this member wants to leave?</DialogContent>
        <DialogActions>
          <Button color="danger" loading={isPending} onClick={leave}>
            Leave
          </Button>
          <Button color="neutral" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ConfirmLeaveModal;
