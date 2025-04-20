import { Member } from "@/hooks/queries/membership/useMembersQuery";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import EntityList, { EntityListRowAction } from "../entity-list";

interface DisplayMemberListProps {
  members: Member[];
  isLoading: boolean;
}

const DisplayMemberList = ({ members, isLoading }: DisplayMemberListProps) => {
  const router = useRouter();

  const cols: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "first_name",
      headerName: "Firstname",
    },
    {
      field: "last_name",
      headerName: "Lastname",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "street",
      headerName: "Street",
    },
    {
      field: "house_nr",
      headerName: "House Nr.",
    },
    {
      field: "zip",
      headerName: "Zip",
    },
    {
      field: "city",
      headerName: "City",
    },
    {
      field: "iban",
      headerName: "IBAN",
    },
    {
      field: "membership_fee",
      headerName: "Membership fee",
    },
  ];

  const rowActions: EntityListRowAction[] = [
    {
      color: "primary",
      name: "Details",
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
