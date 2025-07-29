import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Button
      onClick={() => router.back()}
      variant="outlined"
      sx={{ width: "fit-content" }}
    >
      <ArrowBack /> &nbsp; {t("labels.back")}
    </Button>
  );
};

export default BackButton;
