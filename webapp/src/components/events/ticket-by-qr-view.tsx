import useTicketByQrCodeMutation from "@/hooks/mutations/event/useTicketByQrCodeMutation";
import LoadingComponent from "../loading";
import { Button, Stack } from "@mui/joy";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import TicketDetails from "./ticket-details";
import { useTranslations } from "next-intl";

const TicketByQrCodeView = () => {
  const { data, mutate, reset, isPending } = useTicketByQrCodeMutation();
  const t = useTranslations();

  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <Stack spacing={2}>
      <Button color="primary" onClick={reset}>
        {t("generic.reset")}
      </Button>
      {data === undefined && (
        <BarcodeScannerComponent
          onUpdate={(_, result) => {
            if (result) mutate({ qr_content: result.getText() });
            else reset();
          }}
        />
      )}
      {data && <TicketDetails isShop={false} ticket={data} hasQrCode={false} />}
    </Stack>
  );
};

export default TicketByQrCodeView;
