"use client";

import BackButton from "@/components/back-button";
import KvList, { DisplayedData } from "@/components/kv-list";
import LoadingComponent from "@/components/loading";
import UpdateBackendUserModal from "@/components/user/update-modal";
import UpdateBackendUserPasswordModal from "@/components/user/update-password-modal";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import useBackendUserQuery from "@/hooks/queries/user/useBackendUserQuery";
import { UserRole } from "@/types/api/user";
import { Button, Card, Chip, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const UserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

  const { data, isLoading } = useBackendUserQuery(parseInt(id, 10));

  const displayData = useMemo<DisplayedData[]>(
    () => [
      {
        title: t("generic.id"),
        value: data?.id,
      },
      {
        title: t("labels.user.username"),
        value: data?.username,
      },
      {
        title: t("labels.user.firstName"),
        value: data?.first_name,
      },
      {
        title: t("labels.user.surname"),
        value: data?.surname,
      },
      {
        title: t("labels.user.function"),
        value: data?.function,
      },
      {
        title: t("labels.user.language"),
        value: t(`language.${data?.language}`),
      },
      {
        title: t("labels.user.roles"),
        value: (
          <Stack spacing={1} direction="row" flexWrap="wrap" rowGap={2}>
            {(data?.roles ?? []).map((role) => (
              <Chip variant="soft" color="primary" key={role}>
                {t(`roles.${role}`)}
              </Chip>
            ))}
          </Stack>
        ),
      },
    ],
    [data, t],
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <RoleWrapper roles={[UserRole.Admin]}>
      <Stack spacing={2}>
        <Typography level="h1">{t("headings.userDetails")}</Typography>
        <Divider />
        <Stack direction="row" spacing={2}>
          <BackButton />
          <Button color="primary" onClick={() => setEditModalOpen(true)}>
            {t("generic.edit")}
          </Button>
          <Button
            color="danger"
            variant="outlined"
            onClick={() => setPasswordModalOpen(true)}
          >
            {t("actions.updatePassword")}
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
        {passwordModalOpen && data && (
          <UpdateBackendUserPasswordModal
            user={data}
            onClose={() => setPasswordModalOpen(false)}
          />
        )}
      </Stack>
    </RoleWrapper>
  );
};

export default UserDetailsPage;
