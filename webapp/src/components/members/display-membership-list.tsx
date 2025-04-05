"use client";
import { Member } from "@/hooks/queries/useMembersQuery";
import EntityList, { EntityListRowAction } from "../entity-list";
import { GridColDef } from "@mui/x-data-grid";
import usePayMembershipMutation from "@/hooks/mutations/usePayMembershipMutation";

interface DisplayMembershipListProps {
  members: Member[];
  loading: boolean;
  canPay?: boolean;
  selectedYear?: number;
  refetch?: () => void;
}

const DisplayMembershipList = ({
  members,
  loading,
  canPay = false,
  selectedYear,
  refetch,
}: DisplayMembershipListProps) => {
  const { mutateAsync } = usePayMembershipMutation();

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
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "telephone",
      headerName: "Telephone",
    },
  ];

  const possibleActions: EntityListRowAction[] = [
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
        if (refetch) {
          refetch();
        }
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
