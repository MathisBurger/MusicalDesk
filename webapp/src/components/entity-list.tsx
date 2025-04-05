"use client";
import useCurrentUser, { UserRole } from "@/hooks/useCurrentUser";
import { isGranted } from "@/utils/auth";
import {
  ButtonGroup,
  ButtonProps,
  useColorScheme,
  Button,
  CssVarsProvider,
  Box,
} from "@mui/joy";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { useMemo } from "react";

export interface EntityListRowAction {
  color: ButtonProps["color"];
  name: string;
  onClick: (row: GridRenderCellParams["row"]) => void;
  auth?: UserRole[];
  authFunc?: (row: GridRenderCellParams["row"]) => boolean;
}

interface EntityListProps {
  columns: GridColDef[];
  rowActions?: EntityListRowAction[];
  rows: DataGridProps["rows"];
  loading: boolean;
}

const getRowActions = (row: unknown, actions: EntityListRowAction[]) => {
  return (
    <CssVarsProvider>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <ButtonGroup variant="solid">
          {actions
            .filter((a) => (a.authFunc ? a.authFunc(row) : true))
            .map((action) => (
              <Button
                onClick={() => action.onClick(row)}
                color={action.color}
                key={`${row}_action_${action.name}`}
              >
                {action.name}
              </Button>
            ))}
        </ButtonGroup>
      </Box>
    </CssVarsProvider>
  );
};

const EntityList = ({
  columns,
  rows,
  loading,
  rowActions,
}: EntityListProps) => {
  const { mode } = useColorScheme();

  const user = useCurrentUser();

  const filteredRowActions = useMemo<undefined | EntityListRowAction[]>(() => {
    if (rowActions) {
      return rowActions.filter((a) =>
        a.auth ? isGranted(user, a.auth) : true,
      );
    }
    return undefined;
  }, [rowActions, user]);

  const colDefs = useMemo<GridColDef[]>(() => {
    if (filteredRowActions && filteredRowActions.length > 0) {
      const actions = {
        field: "_actions",
        headerName: "Actions",
        renderCell: (props: GridRenderCellParams) =>
          getRowActions(props.row, filteredRowActions),
      };

      return columns.concat([actions]);
    }

    return columns;
  }, [filteredRowActions, columns]);

  const muiTheme = createTheme({
    palette: {
      mode: mode as "light" | "dark",
    },
    components: {
      MuiPopper: {
        styleOverrides: {
          root: {
            zIndex: "9999 !important",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none !important",
            border: mode === "dark" ? "2px solid #303030" : undefined,
          },
        },
      },
    },
  });

  const processedRows = useMemo<readonly any[]>(
    () => (rows ?? []).map((row, i) => ({ ...row, _ghostId: -i })),
    [rows],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <DataGrid
        rows={processedRows}
        getRowId={(row) => row._ghostId}
        columns={colDefs}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "skeleton",
          },
        }}
      />
    </ThemeProvider>
  );
};

export default EntityList;
