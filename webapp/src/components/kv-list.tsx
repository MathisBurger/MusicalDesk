import { Grid, Typography } from "@mui/joy";
import React, { ReactNode } from "react";

export interface DisplayedData {
  title: string;
  value: ReactNode;
}

interface KvListProps {
  displayData: DisplayedData[];
}

const KvList = ({ displayData }: KvListProps) => {
  return (
    <Grid container spacing={3} sx={{ flexGrow: 1 }}>
      {displayData.map((row) => (
        <React.Fragment key={row.title}>
          <Grid xs={4}>
            <Typography fontWeight="bold">{row.title}:</Typography>
          </Grid>
          <Grid xs={8} key={row.title + "_value"}>
            {row.value}
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default KvList;
