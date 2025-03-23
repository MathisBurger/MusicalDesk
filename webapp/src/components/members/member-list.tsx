import { GridColDef } from "@mui/x-data-grid";
import EntityList from "../entity-list";

const MemberList = () => {
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

  return <EntityList columns={cols} rows={[]} loading={false} />;
};

export default MemberList;
