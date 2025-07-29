import useForm from "@/form/useForm";
import useCreateReportMutation from "@/hooks/mutations/expense/useCreateReportMutation";
import useAlert from "@/hooks/useAlert";
import { CreateReportRequest } from "@/types/api/expense";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useTranslations } from "next-intl";

interface CreateReportModalProps {
  onClose: () => void;
}

const CreateReportModal = ({ onClose }: CreateReportModalProps) => {
  const { mutateAsync: createReport, isPending } = useCreateReportMutation();
  const { displayAlert, showAlert } = useAlert();
  const t = useTranslations();

  const form = useForm<CreateReportRequest>({
    defaultValues: {
      name: "",
    },
    labels: {
      name: t("labels.expense.report.name"),
      start_date: t("labels.expense.report.startDate"),
      end_date: t("labels.expense.report.endDate"),
    },
    explicitTypes: {
      start_date: "datetime-iso",
      end_date: "datetime-iso",
    },
    required: ["name", "start_date", "end_date"],
  });

  const submit = async (req: CreateReportRequest) => {
    const result = await createReport(req);
    if (result) {
      onClose();
      return;
    }
    showAlert({
      color: "danger",
      content: t("messages.expense.cannotCreateReport"),
      duration: 1500,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>{t("modalTitles.expense.createReport")}</DialogTitle>
        {displayAlert()}
        <DialogContent>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={form.onSubmit(submit)} onInvalid={form.onInvalid}>
              {form.renderFormBody()}
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

export default CreateReportModal;
