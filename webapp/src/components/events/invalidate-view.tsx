import useInvalidateTicketMutation from "@/hooks/mutations/event/useInvalidateTicketMutation";
import { Alert, Button, Stack } from "@mui/joy";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import TicketDetails from "./ticket-details";
import LoadingComponent from "../loading";
import { useTranslations } from "next-intl";

const InvalidateView = () => {
  const { data, mutate, reset, isPending } = useInvalidateTicketMutation();
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
      {data === null && (
        <Alert color="danger">
          {t("messages.events.ticketHasBeenInvalidated")}
        </Alert>
      )}
    </Stack>
  );
};

export default InvalidateView;
