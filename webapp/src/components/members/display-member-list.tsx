import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList, { EntityListRowAction } from "../entity-list";
import { Member } from "@/types/api/membership";
import { useTranslations } from "next-intl";

interface DisplayMemberListProps {
  members: Member[];
  isLoading: boolean;
}

const DisplayMemberList = ({ members, isLoading }: DisplayMemberListProps) => {
  const router = useRouter();
  const t = useTranslations();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: t("generic.id"),
    },
    {
      field: "first_name",
      headerName: t("labels.member.firstName"),
    },
    {
      field: "last_name",
      headerName: t("labels.member.lastName"),
    },
    {
      field: "email",
      headerName: t("labels.member.email"),
    },
    {
      field: "street",
      headerName: t("labels.member.street"),
    },
    {
      field: "house_nr",
      headerName: t("labels.member.houseNr"),
    },
    {
      field: "zip",
      headerName: t("labels.member.zip"),
    },
    {
      field: "city",
      headerName: t("labels.member.city"),
    },
    {
      field: "iban",
      headerName: t("labels.member.iban"),
    },
    {
      field: "membership_fee",
      headerName: t("labels.member.membershipFee"),
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      color: "primary",
      name: t("generic.details"),
      onClick: (row) => router.push(`/backend/members/${row.id}`),
    },
  ];

  return (
    <EntityList
      columns={cols}
      rows={members}
      loading={isLoading}
      rowActions={rowActions}
    />
  );
};

export default DisplayMemberList;
