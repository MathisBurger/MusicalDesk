import useCurrentUser, { UserRole } from "@/hooks/useCurrentUser";
import { isGranted } from "@/utils/auth";
import { Alert } from "@mui/joy";
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

  if (!isGranted(currentUser, roles.concat(UserRole.Admin))) {
    if (hideAlert) {
      return null;
    }
    return (
      <Alert variant="soft" color="danger" size="lg">
        You do not have access to this.
      </Alert>
    );
  }

  return <>{children}</>;
};

export default RoleWrapper;
