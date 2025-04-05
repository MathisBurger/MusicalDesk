"use client";
import { Member } from "@/hooks/queries/useMembersQuery";
import EntityList from "../entity-list";
import { GridColDef } from "@mui/x-data-grid";

interface DisplayMembershipListProps {
  members: Member[];
  loading: boolean;
}

const DisplayMembershipList = ({
  members,
  loading,
}: DisplayMembershipListProps) => {
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

  return <EntityList rows={members} loading={loading} columns={cols} />;
};

export default DisplayMembershipList;
