"use client";

import CoreDataTab from "@/components/events/core-data-tab";
import LoadingComponent from "@/components/loading";
import TabLayout from "@/components/wrapper/tab-layout";
import useEventQuery from "@/hooks/queries/useEventQuery";
import {
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  TabPanel,
  Typography,
} from "@mui/joy";
import { useParams } from "next/navigation";

const MemberDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useEventQuery(parseInt(id, 10));

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Stack spacing={2}>
      <Typography level="h2">{data?.name}</Typography>
      <Divider />
      <Card>
        <Stack direction="row" spacing={2}>
          <Button color="primary">Edit</Button>
          <Button color="danger">Leave</Button>
        </Stack>
      </Card>
      <TabLayout tabs={["Core data", "Tickets"]}>
        <TabPanel value={0}>{data && <CoreDataTab event={data} />}</TabPanel>
      </TabLayout>
    </Stack>
  );
};

export default MemberDetailsPage;
