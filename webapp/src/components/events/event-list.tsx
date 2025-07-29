import useEventsQuery from "@/hooks/queries/event/useEventsQuery";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList, { EntityListRowAction } from "../entity-list";
import { useTranslations } from "next-intl";

const EventList = () => {
  const router = useRouter();
  const t = useTranslations();

  const { data, isLoading } = useEventsQuery();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: t("generic.id"),
    },
    {
      field: "name",
      headerName: t("labels.events.name"),
      width: 200,
    },
    {
      field: "price",
      headerName: t("labels.events.price"),
      width: 120,
      valueFormatter: (v) => `${v}€`,
    },
    {
      field: "tax_percentage",
      headerName: t("labels.events.tax"),
      valueFormatter: (v) => `${v}%`,
    },
    {
      field: "event_date",
      headerName: t("labels.events.eventDate"),
      width: 200,
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: t("generic.details"),
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
