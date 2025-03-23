import * as React from "react";
import { Button, Grid, Stack, Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import TabLayout from "@/components/wrapper/tab-layout";

const MembersPage = () => {
  return (
    <Stack spacing={2}>
      <Grid container spacing={4}>
        <Grid>
          <Typography level="h2" component="h1">
            Members
          </Typography>
        </Grid>
        <Grid>
          <Button>
            <Add />
            &nbsp; Create
          </Button>
        </Grid>
      </Grid>
      <TabLayout tabs={["Members", "Memberships"]}></TabLayout>
    </Stack>
  );
};

export default MembersPage;
