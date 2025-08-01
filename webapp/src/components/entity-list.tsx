"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import useMuiTheme from "@/hooks/useMuiTheme";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import {
  ButtonGroup,
  ButtonProps,
  Button,
  CssVarsProvider,
  Box,
} from "@mui/joy";
import { Badge, BadgeProps, styled, Tooltip } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export interface EntityListRowAction {
  color: ButtonProps["color"];
  name: string;
  onClick: (row: GridRenderCellParams["row"]) => void;
  auth?: UserRole[];
  authFunc?: (row: GridRenderCellParams["row"]) => boolean;
}

export type EntityListCol = GridColDef & {
  tooltip?: string;
};

interface EntityListProps {
  columns: EntityListCol[];
  rowActions?: EntityListRowAction[];
  rows: DataGridProps["rows"];
  loading: boolean;
  pageSize?: number;
  page?: number;
  setPageSize?: (pageSize: number) => void;
  setPage?: (page: number) => void;
  paginationMode?: DataGridProps["paginationMode"];
  rowCount?: number;
}

const setFlexPropertyIfAllowed = (def: EntityListCol): EntityListCol => {
  if (def.width) {
    return def;
  }
  return { ...def, flex: 1 };
};

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

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  "& .MuiBadge-badge": {
    right: -8,
    top: 10,
    width: 12,
    height: 12,
    minWidth: 12,
    fontSize: "0.65rem",
    lineHeight: "14px",
    padding: 0,
  },
}));

const EntityList = ({
  columns,
  rows,
  loading,
  rowActions,
  page,
  pageSize,
  setPage,
  setPageSize,
  paginationMode,
  rowCount,
}: EntityListProps) => {
  const user = useCurrentUser();
  const muiTheme = useMuiTheme();
  const t = useTranslations();

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
        headerName: t("labels.actions"),
        flex: 1,
        renderCell: (props: GridRenderCellParams) =>
          getRowActions(props.row, filteredRowActions),
      };

      return columns
        .map(setFlexPropertyIfAllowed)
        .concat([actions])
        .map((column) => ({
          ...column,
          renderHeader: (v) =>
            column.tooltip ? (
              <Box padding="0 25px">
                <Tooltip title={column.tooltip}>
                  <StyledBadge badgeContent={"i"} color="primary">
                    <Box component="span">{v.colDef.headerName}</Box>
                  </StyledBadge>
                </Tooltip>
              </Box>
            ) : (
              v.colDef.headerName
            ),
        }));
    }

    return columns.map(setFlexPropertyIfAllowed);
  }, [filteredRowActions, columns, t]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        paginationModel={page && pageSize ? { pageSize, page } : undefined}
        paginationMode={paginationMode}
        rowCount={rowCount}
        onPaginationModelChange={
          setPage && setPageSize
            ? (model) => {
                setPage(model.page);
                setPageSize(model.pageSize);
              }
            : undefined
        }
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
