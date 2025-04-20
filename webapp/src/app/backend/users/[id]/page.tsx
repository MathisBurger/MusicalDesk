"use client";

import BackButton from "@/components/back-button";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import UpdateBackendUserModal from "@/components/user/update-modal";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useBackendUserQuery from "@/hooks/queries/user/useBackendUserQuery";
import { UserRole } from "@/hooks/useCurrentUser";
import { Button, Card, Chip, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const { data, isLoading } = useBackendUserQuery(parseInt(id, 10));

  const displayData = useMemo<DisplayedData[]>(
    () => [
      {
        title: "ID",
        value: data?.id,
      },
      {
        title: "Username",
        value: data?.username,
      },
      {
        title: "Roles",
        value: (
          <Stack spacing={1} direction="row" flexWrap="wrap" rowGap={2}>
            {(data?.roles ?? []).map((role) => (
              <Chip variant="soft" color="primary" key={role}>
                {role}
              </Chip>
            ))}
          </Stack>
        ),
      },
    ],
    [data],
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.Admin]}>
      <Stack spacing={2}>
        <Typography level="h1">User details</Typography>
        <Divider />
        <Stack direction="row" spacing={2}>
          <BackButton />
          <Button color="primary" onClick={() => setEditModalOpen(true)}>
            Edit
          </Button>
        </Stack>
        <Grid container>
          <Grid xs={6}>
            <Card>
              <KvList displayData={displayData} />
            </Card>
          </Grid>
        </Grid>
        {editModalOpen && data && (
          <UpdateBackendUserModal
            user={data}
            onClose={() => setEditModalOpen(false)}
          />
        )}
      </Stack>
    </RoleWrapper>
  );
};

export default UserDetailsPage;
