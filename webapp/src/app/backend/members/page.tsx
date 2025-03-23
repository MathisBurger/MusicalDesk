import * as React from "react";
import { Button, Grid, Stack, TabPanel, Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import TabLayout from "@/components/wrapper/tab-layout";
import MemberList from "@/components/members/member-list";

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
      <TabLayout tabs={["Members", "Memberships"]}>
        <TabPanel value={0}>
          <MemberList />
        </TabPanel>
      </TabLayout>
    </Stack>
  );
};

export default MembersPage;
