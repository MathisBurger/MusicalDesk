"use client";
import { Member } from "@/hooks/queries/useMembersQuery";
import EntityList, { EntityListRowAction } from "../entity-list";
import { GridColDef } from "@mui/x-data-grid";
import usePayMembershipMutation from "@/hooks/mutations/usePayMembershipMutation";
import { useRouter } from "next/navigation";

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

  const cols: GridColDef[] = [
    {
      field: "first_name",
      headerName: "Firstname",
    },
    {
      field: "last_name",
      headerName: "Lastname",
    },
    {
      field: "membership_fee",
      headerName: "Membership fee",
    },
    {
      field: "iban",
      headerName: "IBAN",
      width: 300,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "telephone",
      headerName: "Telephone",
      width: 150,
    },
  ];

  const possibleActions: EntityListRowAction[] = [
    {
      color: "primary",
      name: "Details",
      onClick: (row) => router.push(`/backend/members/${row.id}`),
    },
    {
      color: "success",
      name: "Has paid",
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
