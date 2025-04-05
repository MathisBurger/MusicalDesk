"use client";
import EntityList from "@/components/entity-list";
import MemberDetails from "@/components/members/member-details";
import EditMemberModal from "@/components/members/modal/edit-member";
import useMemberQuery from "@/hooks/queries/useMemberQuery";
import useUserPaidMembershipsQuery from "@/hooks/queries/useUserPaidMemberships";
import { Button, Card, Divider, Grid, Stack, Typography } from "@mui/joy";
import { GridColDef } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import { useState } from "react";

const MembersDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, refetch } = useMemberQuery(parseInt(id, 10));
  const { data: memberships, isLoading: membershipsLoading } =
    useUserPaidMembershipsQuery(parseInt(id, 10));

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const columns: GridColDef[] = [
    {
      field: "year",
      headerName: "Year",
    },
    {
      field: "paid_at",
      headerName: "Paid at",
      width: 250,
    },
  ];

  return (
    <Stack spacing={2}>
      <Typography level="h2">
        {data?.first_name} {data?.last_name}
      </Typography>
      <Divider />
      <Grid container direction="row" spacing={4}>
        <Grid xs={12}>
          <Card>
            <Stack direction="row" spacing={2}>
              <Button color="primary" onClick={() => setEditModalOpen(true)}>
                Edit
              </Button>
              <Button color="danger">Leave</Button>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={6}>
          <MemberDetails member={data ?? null} loading={isLoading} />
        </Grid>
        <Grid xs={6}>
          <Card>
            <Typography level="h3">Paid Memberships</Typography>
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
          refetch={refetch}
        />
      )}
    </Stack>
  );
};

export default MembersDetailsPage;
