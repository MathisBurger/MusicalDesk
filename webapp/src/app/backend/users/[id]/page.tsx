"use client";

import BackButton from "@/components/back-button";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import useBackendUserQuery from "@/hooks/queries/user/useBackendUserQuery";
import { Card, Chip, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

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
          <Stack spacing={1} direction="row">
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
    <Stack spacing={2}>
      <Typography level="h1">User details</Typography>
      <Divider />
      <BackButton />
      <Grid container>
        <Grid xs={6}>
          <Card>
            <KvList displayData={displayData} />
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UserDetailsPage;
