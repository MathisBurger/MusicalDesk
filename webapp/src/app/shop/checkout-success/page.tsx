"use client";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import { UserRole } from "@/types/api/user";
import { CheckCircle } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <RoleWrapper roles={[UserRole.ShopCustomer]}>
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          height: "70vh",
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: "center" }}>
          <CheckCircle
            sx={{ width: "100%", color: "green", fontSize: "8rem" }}
          />
          <Typography level="h1" fontSize="5em">
            {t("messages.shop.checkoutSuccess")}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", justifyContent: "center" }}
          >
            <Button variant="outlined" onClick={() => router.push("/")}>
              {t("actions.shop.shop")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/shop/my-tickets")}
            >
              {t("actions.shop.myTickets")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </RoleWrapper>
  );
};

export default CheckoutSuccessPage;
