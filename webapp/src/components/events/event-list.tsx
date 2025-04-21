import useEventsQuery from "@/hooks/queries/event/useEventsQuery";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList, { EntityListRowAction } from "../entity-list";

const EventList = () => {
  const router = useRouter();

  const { data, isLoading } = useEventsQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      valueFormatter: (v) => `${v}€`,
    },
    {
      field: "tax_percentage",
      headerName: "Tax",
      valueFormatter: (v) => `${v}%`,
    },
    {
      field: "event_date",
      headerName: "Event Date",
      width: 200,
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: "Details",
      color: "primary",
      onClick: (row) => router.push(`/backend/events/${row.id}`),
    },
  ];

  return (
    <EntityList
      rows={data ?? []}
      columns={cols}
      loading={isLoading}
      rowActions={rowActions}
    />
  );
};

export default EventList;
