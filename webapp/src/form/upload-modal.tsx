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
import { useRef, useState } from "react";
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
  const [name, setName] = useState<string>("");
  const { displayAlert, showAlert } = useAlert();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = async () => {
    if (!fileInputRef.current?.files || name === "") {
      showAlert({
        color: "danger",
        content: "Please fill the form",
      });
      return;
    }

    setLoading(true);

    const file = fileInputRef.current?.files?.item(0);
    if (!file || file.size === 0) {
      showAlert({
        color: "danger",
        content: "No file submitted",
        duration: 1000,
      });
    } else {
      const result = await uploadFn(name, file);
      if (result.error) {
        showAlert({
          color: "danger",
          content: "Upload failed",
          duration: 1000,
        });
      } else {
        setCurrentFile({
          fileId: result.imageId ?? -1,
          name: name,
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
          <FormControl required>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              required
              sx={{ marginBottom: "1.5em" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <input
            name="file"
            type="file"
            accept={accept}
            required
            ref={fileInputRef}
            onChange={(e) => setName(e.target.value.split("\\").reverse()[0])}
          />
          <DialogActions>
            <Button loading={loading} onClick={uploadFile}>
              Create
            </Button>
            <Button color="neutral" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default UploadModal;
