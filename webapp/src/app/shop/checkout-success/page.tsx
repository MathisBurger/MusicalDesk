"use client";
import { Check, CheckCircle } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

const CheckoutSuccessPage = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        height: "70vh",
      }}
    >
      <Stack spacing={2} sx={{ justifyContent: "center" }}>
        <CheckCircle sx={{ width: "100%", color: "green", fontSize: "8rem" }} />
        <Typography level="h1" fontSize="5em">
          Checkout success
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
            onClick={() => router.push("/shop/my-tickets")}
          >
            My tickets
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CheckoutSuccessPage;
