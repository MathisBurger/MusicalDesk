"use client";
import RoleWrapper from "@/components/wrapper/role-wrapper";
import { UserRole } from "@/types/api/user";
import { Error } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

const CheckoutCanceledPage = () => {
  const router = useRouter();

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
          <Error sx={{ width: "100%", color: "red", fontSize: "8rem" }} />
          <Typography level="h1" fontSize="5em">
            Checkout canceled
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", justifyContent: "center" }}
          >
            <Button variant="outlined" onClick={() => router.push("/")}>
              Shop
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/shop/my-shopping-cart")}
            >
              Shopping Cart
            </Button>
          </Stack>
        </Stack>
      </Box>
    </RoleWrapper>
  );
};

export default CheckoutCanceledPage;
