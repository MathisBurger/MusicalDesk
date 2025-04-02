"use client";
import { Member } from "@/hooks/queries/useMembersQuery";
import EntityList from "../entity-list";
import { GridColDef } from "@mui/x-data-grid";

interface UnpaidMembershipListProps {
  members: Member[];
  loading: boolean;
}

const UnpaidMembershipList = ({
  members,
  loading,
}: UnpaidMembershipListProps) => {
  const cols: GridColDef[] = [
    {
      field: "firstName",
      headerName: "Firstname",
    },
    {
      field: "lastName",
      headerName: "Lastname",
    },
  ];

  return <EntityList rows={members} loading={loading} columns={cols} />;
};

export default UnpaidMembershipList;
