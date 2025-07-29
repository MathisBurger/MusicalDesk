"use client";
import FormInput from "@/form/form-input";
import { FormValue } from "@/form/types";
import useForm from "@/form/useForm";
import useCreateMemberMutation from "@/hooks/mutations/membership/useCreateMemberMutation";
import useAlert from "@/hooks/useAlert";
import { CreateMemberRequest } from "@/types/api/membership";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface CreateMemberModalProps {
  onClose: () => void;
}

const CreateMemberModal = ({ onClose }: CreateMemberModalProps) => {
  const { mutateAsync, isPending } = useCreateMemberMutation();
  const { showAlert, displayAlert } = useAlert();
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<CreateMemberRequest>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      street: "",
      house_nr: "",
      zip: "",
      city: "",
      iban: "",
      membership_fee: 0,
    },
    labels: {
      first_name: t("labels.member.firstName"),
      last_name: t("labels.member.lastName"),
      email: t("labels.member.email"),
      street: t("labels.member.street"),
      house_nr: t("labels.member.houseNr"),
      zip: t("labels.member.zip"),
      city: t("labels.member.city"),
      iban: t("labels.member.iban"),
      membership_fee: t("labels.member.membershipFee"),
    },
    validation: {
      iban: (v: FormValue) =>
        v === null || v === ""
          ? null
          : /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(
                (v as string).replace(/\s+/g, "").toUpperCase(),
              )
            ? null
            : t("validation.member.iban"),
    },
    required: ["first_name", "last_name"],
  });

  const onSubmit = async (values: CreateMemberRequest) => {
    "use client";
    const result = await mutateAsync(values);
    if (result !== null) {
      router.push(`/backend/members/${result?.id}`);
    } else {
      showAlert({
        color: "danger",
        content: t("messages.member.cannotCreateMember"),
      });
    }
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.member.createMember")}</DialogTitle>
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            {displayAlert()}
            <form onSubmit={form.onSubmit(onSubmit)}>
              <FormInput {...form.getInputProps("first_name")} />
              <FormInput {...form.getInputProps("last_name")} />
              <FormInput {...form.getInputProps("email")} />
              <Grid container direction="row" spacing={2}>
                <Grid xs={9}>
                  <FormInput {...form.getInputProps("street")} />
                </Grid>
                <Grid xs={3}>
                  <FormInput {...form.getInputProps("house_nr")} />
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={2}>
                <Grid xs={4}>
                  <FormInput {...form.getInputProps("zip")} />
                </Grid>
                <Grid xs={8}>
                  <FormInput {...form.getInputProps("city")} />
                </Grid>
              </Grid>
              <FormInput {...form.getInputProps("iban")} />
              <FormInput {...form.getInputProps("membership_fee")} />
              <DialogActions>
                <Button type="submit" loading={isPending}>
                  {t("generic.create")}
                </Button>
                <Button color="neutral" onClick={onClose}>
                  {t("generic.cancel")}
                </Button>
              </DialogActions>
            </form>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default CreateMemberModal;
