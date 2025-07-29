"use client";
import BackButton from "@/components/back-button";
import EntityList from "@/components/entity-list";
import MemberDetails from "@/components/members/member-details";
import ConfirmLeaveModal from "@/components/members/modal/confirm-leave";
import EditMemberModal from "@/components/members/modal/edit-member";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useMemberQuery from "@/hooks/queries/membership/useMemberQuery";
import useUserPaidMembershipsQuery from "@/hooks/queries/membership/useUserPaidMemberships";
import { UserRole } from "@/types/api/user";
import { Button, Card, Divider, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

const MembersDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();

  const { data, isLoading } = useMemberQuery(parseInt(id, 10));
  const { data: memberships, isLoading: membershipsLoading } =
    useUserPaidMembershipsQuery(parseInt(id, 10));

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState<boolean>(false);

  const columns: GridColDef[] = [
    {
      field: "year",
      headerName: t("labels.member.year"),
    },
    {
      field: "paid_at",
      headerName: t("labels.member.paidAt"),
      width: 250,
    },
  ];

  return (
    <RoleWrapper roles={[UserRole.MemberAdmin]}>
      <Stack spacing={2}>
        <Typography level="h2">
          <BackButton /> &nbsp;
          {data?.first_name} {data?.last_name}
        </Typography>
        <Divider />

        <Grid container direction="row" spacing={4}>
          <Grid xs={12}>
            <Card>
              <Stack direction="row" spacing={2}>
                <Button color="primary" onClick={() => setEditModalOpen(true)}>
                  {t("generic.edit")}
                </Button>
                <Button color="danger" onClick={() => setLeaveModalOpen(true)}>
                  {t("actions.member.leave")}
                </Button>
              </Stack>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <MemberDetails member={data ?? null} loading={isLoading} />
          </Grid>
          <Grid xs={12} md={6}>
            <Card>
              <Typography level="h3">
                {t("headings.paidMemberships")}
              </Typography>
              <EntityList
                loading={membershipsLoading}
                rows={memberships ?? []}
                columns={columns}
              />
            </Card>
          </Grid>
        </Grid>
        {editModalOpen && data && (
          <EditMemberModal
            memberId={parseInt(id, 10)}
            onClose={() => setEditModalOpen(false)}
            member={data}
          />
        )}
        {leaveModalOpen && (
          <ConfirmLeaveModal
            onClose={() => setLeaveModalOpen(false)}
            memberId={parseInt(id, 10)}
          />
        )}
      </Stack>
    </RoleWrapper>
  );
};

export default MembersDetailsPage;
