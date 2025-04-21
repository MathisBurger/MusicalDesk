import useEventTicketsQuery from "@/hooks/queries/event/useEventTicketsQuery";
import { GridColDef } from "@mui/x-data-grid";
import EntityList, { EntityListRowAction } from "../entity-list";
import { useRouter } from "next/navigation";

interface EventTicketListProps {
  eventId: number;
}

const EventTicketList = ({ eventId }: EventTicketListProps) => {
  const { data, isLoading } = useEventTicketsQuery(eventId);
  const router = useRouter();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "valid_until",
      headerName: "Valid until",
      width: 200,
    },
    {
      field: "invalidated_at",
      headerName: "Invalidated at",
      width: 200,
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: "Details",
      color: "primary",
      onClick: (row) =>
        router.push(`/backend/events/${eventId}/tickets/${row.id}`),
    },
  ];

  return (
    <EntityList
      columns={cols}
      rows={data ?? []}
      loading={isLoading}
      rowActions={rowActions}
    />
  );
};

export default EventTicketList;
