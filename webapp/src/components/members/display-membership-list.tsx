"use client";
import EntityList, { EntityListRowAction } from "../entity-list";
import { GridColDef } from "@mui/x-data-grid";
import usePayMembershipMutation from "@/hooks/mutations/membership/usePayMembershipMutation";
import { useRouter } from "next/navigation";
import { Member } from "@/types/api/membership";
import { useTranslations } from "next-intl";

interface DisplayMembershipListProps {
  members: Member[];
  loading: boolean;
  canPay?: boolean;
  selectedYear?: number;
}

const DisplayMembershipList = ({
  members,
  loading,
  canPay = false,
  selectedYear,
}: DisplayMembershipListProps) => {
  const { mutateAsync } = usePayMembershipMutation(selectedYear ?? -1);
  const router = useRouter();
  const t = useTranslations();

  const cols: GridColDef[] = [
    {
      field: "first_name",
      headerName: t("labels.member.firstName"),
    },
    {
      field: "last_name",
      headerName: t("labels.member.lastName"),
    },
    {
      field: "membership_fee",
      headerName: t("labels.member.membershipFee"),
    },
    {
      field: "iban",
      headerName: t("labels.member.iban"),
      width: 300,
    },
    {
      field: "email",
      headerName: t("labels.member.email"),
      width: 200,
    },
  ];

  const possibleActions: EntityListRowAction[] = [
    {
      color: "primary",
      name: t("generic.details"),
      onClick: (row) => router.push(`/backend/members/${row.id}`),
    },
    {
      color: "success",
      name: t("actions.member.hasPaid"),
      onClick: async (row) => {
        console.log(row);
        await mutateAsync({
          year: selectedYear ?? new Date().getFullYear(),
          member_id: row.id,
          paid_at: new Date().toISOString(),
        });
      },
      authFunc: () => canPay,
    },
  ];

  return (
    <EntityList
      rows={members}
      loading={loading}
      columns={cols}
      rowActions={possibleActions}
    />
  );
};

export default DisplayMembershipList;
