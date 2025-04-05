"use client";
import { GridColDef } from "@mui/x-data-grid";
import EntityList, { EntityListRowAction } from "../entity-list";
import useMembersQuery from "@/hooks/queries/useMembersQuery";
import { useRouter } from "next/navigation";

const MemberList = () => {
  const { data, isLoading } = useMembersQuery();
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
      rows={data ?? []}
      loading={isLoading}
      rowActions={rowActions}
    />
  );
};

export default MemberList;
