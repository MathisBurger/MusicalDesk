"use client";
import { useState } from "react";
import { Button, Grid, Stack, TabPanel, Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import TabLayout from "@/components/wrapper/tab-layout";
import CreateMemberModal from "@/components/members/modal/create-member";
import MembershipList from "@/components/members/membership-list";
import useMembersQuery from "@/hooks/queries/useMembersQuery";
import DisplayMemberList from "@/components/members/display-member-list";
import useMembersLeftQuery from "@/hooks/queries/useMembersLeftQuery";

const MembersPage = () => {
  const [createMemberModalOpen, setCreateMemberModalOpen] =
    useState<boolean>(false);

  const { data: members, isLoading: membersLoading } = useMembersQuery();
  const { data: leftMembers, isLoading: leftMembersLoading } =
    useMembersLeftQuery();

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
      <TabLayout tabs={["Members", "Left Members", "Memberships"]}>
        <TabPanel value={0}>
          <DisplayMemberList
            members={members ?? []}
            isLoading={membersLoading}
          />
        </TabPanel>
        <TabPanel value={1}>
          <DisplayMemberList
            members={leftMembers ?? []}
            isLoading={leftMembersLoading}
          />
        </TabPanel>
        <TabPanel value={2}>
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
