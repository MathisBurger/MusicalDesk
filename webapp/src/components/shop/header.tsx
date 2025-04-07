import useCurrentUser from "@/hooks/useCurrentUser";
import {
  LanguageRounded,
  MenuRounded,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  DialogTitle,
  Drawer,
  IconButton,
  ModalClose,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ShopHeader = () => {
  const [open, setOpen] = useState(false);

  const currentUser = useCurrentUser();
  const router = useRouter();

  return (
    <Box
      component="header"
      className="Header"
      sx={[
        {
          p: 2,
          gap: 2,
          bgcolor: "background.surface",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gridColumn: "1 / -1",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        },
      ]}
    >
      <Box
        sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: { xs: "none", sm: "flex" },
          }}
        >
          <IconButton
            size="md"
            variant="outlined"
            color="neutral"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: "50%",
            }}
          >
            <LanguageRounded />
          </IconButton>
          <Button
            variant="plain"
            color="neutral"
            size="sm"
            sx={{ alignSelf: "center" }}
            onClick={() => router.push("/")}
          >
            Shop
          </Button>
          {currentUser && (
            <Button
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ alignSelf: "center" }}
              onClick={() => router.push("/backend/dashboard")}
            >
              Personal Area
            </Button>
          )}
        </Stack>
        <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
          <IconButton
            variant="plain"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            <MenuRounded />
          </IconButton>
          <Drawer
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
            open={open}
            onClose={() => setOpen(false)}
          >
            <ModalClose />
            <DialogTitle>Acme Co.</DialogTitle>
            <Box sx={{ px: 1 }}>
              <p>Content here </p>
            </Box>
          </Drawer>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <Tooltip title="Shopping Cart" variant="outlined">
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              sx={{ alignSelf: "center" }}
            >
              <ShoppingCart />
            </IconButton>
          </Tooltip>
          {currentUser && (
            <>
              <Avatar
                src="https://i.pravatar.cc/40?img=2"
                srcSet="https://i.pravatar.cc/80?img=2"
                sx={{ borderRadius: "50%" }}
              />
              <Typography>{currentUser?.username}</Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ShopHeader;
