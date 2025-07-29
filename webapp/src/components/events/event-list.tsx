import useEventsQuery from "@/hooks/queries/event/useEventsQuery";
import { useRouter } from "next/navigation";
import EntityList, { EntityListCol, EntityListRowAction } from "../entity-list";
import { useTranslations } from "next-intl";

const EventList = () => {
  const router = useRouter();
  const t = useTranslations();

  const { data, isLoading } = useEventsQuery();

  const cols: EntityListCol[] = [
    {
      field: "id",
      headerName: t("generic.id"),
      tooltip: t("tooltips.id"),
    },
    {
      field: "name",
      headerName: t("labels.events.name"),
      width: 200,
      tooltip: t("tooltips.event.name"),
    },
    {
      field: "price",
      headerName: t("labels.events.price"),
      width: 120,
      valueFormatter: (v) => `${v}€`,
      tooltip: t("tooltips.event.price"),
    },
    {
      field: "tax_percentage",
      headerName: t("labels.events.tax"),
      valueFormatter: (v) => `${v}%`,
      tooltip: t("tooltips.event.tax"),
    },
    {
      field: "event_date",
      headerName: t("labels.events.eventDate"),
      width: 200,
      tooltip: t("tooltips.event.eventDate"),
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
