"use client";
import { GridColDef } from "@mui/x-data-grid";
import EntityList from "../entity-list";
import useMembersQuery from "@/hooks/queries/useMembersQuery";

const MemberList = () => {
  const { data, isLoading } = useMembersQuery();

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
  ];

  return <EntityList columns={cols} rows={data ?? []} loading={isLoading} />;
};

export default MemberList;
