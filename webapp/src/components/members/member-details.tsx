import LoadingComponent from "../loading";
import { Card, Typography } from "@mui/joy";
import { useMemo } from "react";
import KvList, { DisplayedData } from "../kv-list";
import { Member } from "@/types/api/membership";
import { useTranslations } from "next-intl";

interface MemberDetailsProps {
  loading: boolean;
  member: Member | null;
}

const MemberDetails = ({ loading, member }: MemberDetailsProps) => {
  const t = useTranslations();

  const displayData = useMemo<DisplayedData[]>(
    () => [
      {
        title: t("labels.member.firstName"),
        value: member?.first_name,
      },
      {
        title: t("labels.member.lastName"),
        value: member?.last_name,
      },
      {
        title: t("labels.member.email"),
        value: member?.email,
      },
      {
        title: t("labels.member.address"),
        value: `${member?.street ?? ""} ${member?.house_nr ?? ""}`,
      },
      {
        title: t("labels.member.city"),
        value: `${member?.zip ?? ""} ${member?.city ?? ""}`,
      },
      {
        title: t("labels.member.iban"),
        value: member?.iban,
      },
      {
        title: t("labels.member.membershipFee"),
        value: member?.membership_fee,
      },
      {
        title: t("labels.member.leftAt"),
        value: member?.left_at
          ? new Date(member.left_at * 1000).toISOString()
          : t("generic.never"),
      },
    ],
    [member, t],
  );

  if (loading) {
    return (
      <Card>
        <LoadingComponent />
      </Card>
    );
  }

  return (
    <Card>
      <Typography level="h3">{t("headings.coreData")}</Typography>
      <KvList displayData={displayData} />
    </Card>
  );
};

export default MemberDetails;
