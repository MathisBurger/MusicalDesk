import useEventTicketsQuery from "@/hooks/queries/useEventTicketsQuery";
import { GridColDef } from "@mui/x-data-grid";
import EntityList from "../entity-list";

interface EventTicketListProps {
  eventId: number;
}

const EventTicketList = ({ eventId }: EventTicketListProps) => {
  const { data, isLoading } = useEventTicketsQuery(eventId);

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "valid_until",
      headerName: "Valid until",
    },
    {
      field: "invalidated",
      headerName: "Invalidated",
    },
    {
      field: "invalidated_at",
      headerName: "Invalidated at",
    },
  ];

  return <EntityList columns={cols} rows={data ?? []} loading={isLoading} />;
};

export default EventTicketList;
