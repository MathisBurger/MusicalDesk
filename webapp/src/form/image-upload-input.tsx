import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
} from "@mui/joy";
import { SupportedInputProps } from "./types";
import { InfoOutlined, Upload } from "@mui/icons-material";
import { useState } from "react";
import UploadModal from "./upload-modal";

export interface UploadFnResult {
  error?: string;
  imageId?: number;
}

export interface CurrentFile {
  fileId: number;
  name: string;
}

interface ImageUploadInputProps
  extends Omit<SupportedInputProps, "type" | "defaultValue"> {
  uploadFn: (name: string, file: File) => Promise<UploadFnResult>;
  accept?: string;
}

const ImageUploadInput = ({
  name,
  label,
  required,
  error,
  uploadFn,
  accept,
}: ImageUploadInputProps) => {
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<CurrentFile | null>(null);

  return (
    <FormControl required={required} error={error !== undefined}>
      {label && <FormLabel>{label}</FormLabel>}
      <Grid container direction="row" spacing={1}>
        <Grid xs={11}>
          <Input value={currentFile?.name} disabled required={required} />
          <input
            name={name}
            value={currentFile?.fileId}
            style={{ display: "none" }}
            required={required}
          />
        </Grid>
        <Grid xs={1}>
          <Button
            color="neutral"
            onClick={() => setUploadModalOpen(true)}
            type="button"
          >
            <Upload />
          </Button>
        </Grid>
      </Grid>
      {error && (
        <FormHelperText>
          <InfoOutlined />
          {error}
        </FormHelperText>
      )}
      {uploadModalOpen && (
        <UploadModal
          onClose={() => setUploadModalOpen(false)}
          uploadFn={uploadFn}
          accept={accept}
          setCurrentFile={setCurrentFile}
        />
      )}
    </FormControl>
  );
};

export default ImageUploadInput;
