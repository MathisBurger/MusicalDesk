import LoadingComponent from "../loading";
import { Card, Typography } from "@mui/joy";
import { useMemo } from "react";
import KvList, { DisplayedData } from "../kv-list";
import { Member } from "@/types/api/membership";

interface MemberDetailsProps {
  loading: boolean;
  member: Member | null;
}

const MemberDetails = ({ loading, member }: MemberDetailsProps) => {
  const displayData = useMemo<DisplayedData[]>(
    () => [
      {
        title: "First name",
        value: member?.first_name,
      },
      {
        title: "Last name",
        value: member?.last_name,
      },
      {
        title: "Email",
        value: member?.email,
      },
      {
        title: "Address",
        value: `${member?.street ?? ""} ${member?.house_nr ?? ""}`,
      },
      {
        title: "City",
        value: `${member?.zip ?? ""} ${member?.city ?? ""}`,
      },
      {
        title: "IBAN",
        value: member?.iban,
      },
      {
        title: "Membership fee",
        value: member?.membership_fee,
      },
      {
        title: "Left at",
        value: member?.left_at
          ? new Date(member.left_at * 1000).toISOString()
          : "<never>",
      },
    ],
    [member],
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
      <Typography level="h3">Core data</Typography>
      <KvList displayData={displayData} />
    </Card>
  );
};

export default MemberDetails;
