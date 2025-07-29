"use client";
import LoadingComponent from "@/components/loading";
import TicketDetails from "@/components/events/ticket-details";
import useUserTicketQuery from "@/hooks/queries/event/useUserTicketQuery";
import { Alert } from "@mui/joy";
import { useParams } from "next/navigation";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import { UserRole } from "@/types/api/user";
import { useTranslations } from "next-intl";

const MyTicketDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();
  const { data, isLoading } = useUserTicketQuery(parseInt(id, 10));

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (data) {
    return (
      <RoleWrapper roles={[UserRole.ShopCustomer]}>
        <TicketDetails isShop ticket={data} />
      </RoleWrapper>
    );
  }

  return (
    <RoleWrapper roles={[UserRole.ShopCustomer]}>
      <Alert variant="soft" size="lg" color="danger">
        {t("messages.shop.ticketNotFound")}
      </Alert>
    </RoleWrapper>
  );
};

export default MyTicketDetailsPage;
