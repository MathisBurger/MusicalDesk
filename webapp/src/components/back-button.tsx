import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outlined"
      sx={{ width: "fit-content" }}
    >
      <ArrowBack /> &nbsp; Back
    </Button>
  );
};

export default BackButton;
