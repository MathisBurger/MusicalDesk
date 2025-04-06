"use client";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { CurrentFile, UploadFnResult } from "./image-upload-input";
import { FormEvent, useState } from "react";
import useAlert from "@/hooks/useAlert";

interface UploadModalProps {
  onClose: () => void;
  uploadFn: (name: string, file: File) => Promise<UploadFnResult>;
  setCurrentFile: (current: CurrentFile) => void;
  accept?: string;
}

const UploadModal = ({
  onClose,
  uploadFn,
  accept,
  setCurrentFile,
}: UploadModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [placeholderName, setPlaceholderName] = useState<string>("");
  const { displayAlert, showAlert } = useAlert();

  const uploadFile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const file: File | null = formData.get("file") as File | null;
    if (file === null || file.size === 0) {
      showAlert({
        color: "danger",
        content: "No file submitted",
        duration: 1000,
      });
    } else {
      const result = await uploadFn(formData.get("name") as string, file);
      if (result.error) {
        showAlert({
          color: "danger",
          content: "Upload failed",
          duration: 1000,
        });
      } else {
        setCurrentFile({
          fileId: result.imageId ?? -1,
          name: formData.get("name") as string,
        });
        onClose();
      }
    }

    setLoading(false);
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog>
        <ModalClose />
        <DialogTitle>Upload file</DialogTitle>
        <DialogContent>
          {displayAlert()}
          <form onSubmit={uploadFile}>
            <FormControl required>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                required
                sx={{ marginBottom: "1.5em" }}
                defaultValue={placeholderName}
              />
            </FormControl>
            <input
              name="file"
              type="file"
              accept={accept}
              required
              onChange={(e) =>
                setPlaceholderName(e.target.value.split("\\").reverse()[0])
              }
            />
            <DialogActions>
              <Button loading={loading} type="submit">
                Create
              </Button>
              <Button color="neutral" onClick={onClose}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default UploadModal;
