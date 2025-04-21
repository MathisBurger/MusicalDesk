import useInvalidateTicketMutation from "@/hooks/mutations/event/useInvalidateTicketMutation";
import { Alert, Button, Stack } from "@mui/joy";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import TicketDetails from "./ticket-details";
import LoadingComponent from "../loading";

const InvalidateView = () => {
  const { data, mutate, reset, isPending } = useInvalidateTicketMutation();

  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <Stack spacing={2}>
      <Button color="primary" onClick={reset}>
        Reset
      </Button>
      {data === undefined && (
        <BarcodeScannerComponent
          width={500}
          height={500}
          onUpdate={(_, result) => {
            if (result) mutate({ qr_content: result.getText() });
            else reset();
          }}
        />
      )}
      {data && <TicketDetails isShop={false} ticket={data} hasQrCode={false} />}
      {data === null && (
        <Alert color="danger">Ticket has already been invalidated</Alert>
      )}
    </Stack>
  );
};

export default InvalidateView;
