"use client";
import { useState } from "react";
import { Button, Divider, Grid, Stack, TabPanel, Typography } from "@mui/joy";
import { Add } from "@mui/icons-material";
import TabLayout from "@/components/wrapper/tab-layout";
import CreateMemberModal from "@/components/members/modal/create-member";
import MembershipList from "@/components/members/membership-list";
import useMembersQuery from "@/hooks/queries/membership/useMembersQuery";
import DisplayMemberList from "@/components/members/display-member-list";
import useMembersLeftQuery from "@/hooks/queries/membership/useMembersLeftQuery";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import { UserRole } from "@/types/api/user";
import { useTranslations } from "next-intl";

const MembersPage = () => {
  const t = useTranslations();
  const [createMemberModalOpen, setCreateMemberModalOpen] =
    useState<boolean>(false);

  const { data: members, isLoading: membersLoading } = useMembersQuery();
  const { data: leftMembers, isLoading: leftMembersLoading } =
    useMembersLeftQuery();

  return (
    <RoleWrapper roles={[UserRole.MemberAdmin]}>
      <Stack spacing={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Typography level="h1">{t("headings.members")}</Typography>
          </Grid>
          <Grid>
            <Button onClick={() => setCreateMemberModalOpen(true)}>
              <Add />
              &nbsp; {t("generic.create")}
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <TabLayout
          tabs={[
            t("tabs.member.members"),
            t("tabs.member.leftMembers"),
            t("tabs.member.memberships"),
          ]}
        >
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
    </RoleWrapper>
  );
};

export default MembersPage;
