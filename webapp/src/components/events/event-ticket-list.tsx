import useEventTicketsQuery from "@/hooks/queries/event/useEventTicketsQuery";
import EntityList, { EntityListCol, EntityListRowAction } from "../entity-list";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface EventTicketListProps {
  eventId: number;
}

const EventTicketList = ({ eventId }: EventTicketListProps) => {
  const { data, isLoading } = useEventTicketsQuery(eventId);
  const router = useRouter();
  const t = useTranslations();

  const cols: EntityListCol[] = [
    {
      field: "id",
      headerName: t("generic.id"),
      tooltip: t("tooltips.id"),
    },
    {
      field: "valid_until",
      headerName: t("labels.events.ticket.validUntil"),
      width: 200,
      tooltip: t("tooltips.event.ticket.validUntil"),
    },
    {
      field: "invalidated_at",
      headerName: t("labels.events.ticket.invalidatedAt"),
      width: 200,
      tooltip: t("tooltips.event.ticket.invalidatedAt"),
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      name: t("generic.details"),
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
