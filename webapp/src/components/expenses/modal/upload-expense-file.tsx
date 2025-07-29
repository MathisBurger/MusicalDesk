import useUploadFileToExpenseMutation from "@/hooks/mutations/expense/useUploadFileToExpenseMutation";
import useAlert from "@/hooks/useAlert";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { useState } from "react";
import Dropzone from "../../dropzone";
import { useTranslations } from "next-intl";

interface UploadExpenseFileModalProps {
  onClose: () => void;
  expenseId: number;
}

const UploadExpenseFileModal = ({
  onClose,
  expenseId,
}: UploadExpenseFileModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { displayAlert, showAlert } = useAlert();
  const { mutateAsync, isPending } = useUploadFileToExpenseMutation(expenseId);
  const t = useTranslations();

  const submit = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    const result = await mutateAsync(formData);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotUploadFiles"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <DialogTitle>{t("modalTitles.expense.uploadFile")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Dropzone files={files} setFiles={setFiles} />
          <DialogActions>
            <Button onClick={submit} loading={isPending}>
              {t("generic.create")}
            </Button>
            <Button color="neutral" onClick={onClose}>
              {t("generic.cancel")}
            </Button>
          </DialogActions>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default UploadExpenseFileModal;
