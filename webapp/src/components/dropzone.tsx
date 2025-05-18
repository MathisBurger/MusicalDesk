import { Card, Stack } from "@mui/joy";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const Dropzone = ({ files, setFiles }: DropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
    },
    [setFiles],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card variant="outlined">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      <Stack direction="row" spacing={2}>
        {files.map((file, i) => (
          <Card key={`${file.name}_${i}`}>{file.name}</Card>
        ))}
      </Stack>
    </Card>
  );
};

export default Dropzone;
