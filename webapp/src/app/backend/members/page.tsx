"use client";
import { useState } from "react";
import { Button, Grid, Stack, TabPanel, Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import TabLayout from "@/components/wrapper/tab-layout";
import MemberList from "@/components/members/member-list";
import CreateMemberModal from "@/components/members/modal/create-member";
import MembershipList from "@/components/members/membership-list";

const MembersPage = () => {
  const [createMemberModalOpen, setCreateMemberModalOpen] =
    useState<boolean>(false);

  return (
    <Stack spacing={2}>
      <Grid container spacing={4}>
        <Grid>
          <Typography level="h2" component="h1">
            Members
          </Typography>
        </Grid>
        <Grid>
          <Button onClick={() => setCreateMemberModalOpen(true)}>
            <Add />
            &nbsp; Create
          </Button>
        </Grid>
      </Grid>
      <TabLayout tabs={["Members", "Memberships"]}>
        <TabPanel value={0}>
          <MemberList />
        </TabPanel>
        <TabPanel value={1}>
          <MembershipList />
        </TabPanel>
      </TabLayout>
      {createMemberModalOpen && (
        <CreateMemberModal onClose={() => setCreateMemberModalOpen(false)} />
      )}
    </Stack>
  );
};

export default MembersPage;
