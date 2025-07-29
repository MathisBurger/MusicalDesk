import useCurrentUser from "@/hooks/useCurrentUser";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import { Alert } from "@mui/joy";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";

interface RoleWrapperProps {
  roles: UserRole[];
  hideAlert?: boolean;
}

/**
 * Wrapper to ensure only specific roles can access components.
 * NOTE: Admin can access everything
 *
 * @returns
 */
const RoleWrapper = ({
  children,
  roles,
  hideAlert,
}: PropsWithChildren<RoleWrapperProps>) => {
  const currentUser = useCurrentUser();
  const t = useTranslations();

  if (!isGranted(currentUser, roles.concat(UserRole.Admin))) {
    if (hideAlert) {
      return null;
    }
    return (
      <Alert variant="soft" color="danger" size="lg">
        {t("messages.noAccess")}
      </Alert>
    );
  }

  return <>{children}</>;
};

export default RoleWrapper;
