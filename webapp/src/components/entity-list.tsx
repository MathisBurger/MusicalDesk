"use client";
import { useColorScheme } from "@mui/joy";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";

interface EntityListProps {
  columns: GridColDef[];
  rows: DataGridProps["rows"];
  loading: boolean;
}

const EntityList = ({ columns, rows, loading }: EntityListProps) => {
  const { mode } = useColorScheme();

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

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <DataGrid
        rows={rows}
        columns={columns}
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
