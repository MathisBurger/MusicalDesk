import { Grid, Typography } from "@mui/joy";

export interface DisplayedData {
  title: string;
  value: string | number | undefined | null;
}

interface KvListProps {
  displayData: DisplayedData[];
}

const KvList = ({ displayData }: KvListProps) => {
  return (
    <Grid container spacing={3} sx={{ flexGrow: 1 }}>
      {displayData.map((row) => (
        <>
          <Grid xs={4}>
            <Typography fontWeight="bold">{row.title}:</Typography>
          </Grid>
          <Grid xs={8}>{row.value}</Grid>
        </>
      ))}
    </Grid>
  );
};

export default KvList;
