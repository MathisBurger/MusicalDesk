import useShoppingCartQuery from "@/hooks/queries/shop/useShoppingCartQuery";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLogout from "@/hooks/useLogout";
import { UserRole } from "@/types/api/user";
import { isGranted } from "@/utils/auth";
import {
  LanguageRounded,
  MenuRounded,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  DialogTitle,
  Drawer,
  Dropdown,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  MenuButton,
  MenuItem,
  ModalClose,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { Button } from "@mui/joy";
import { Menu } from "@mui/joy";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ShopHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentUser = useCurrentUser();
  const router = useRouter();
  const logout = useLogout();
  const pathname = usePathname();

  const { data: shoppingCart } = useShoppingCartQuery();

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
          zIndex: 9998,
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
              onClick={() => router.push("/shop/my-tickets")}
            >
              My tickets
            </Button>
          )}
          {!isGranted(currentUser, [UserRole.ShopCustomer]) && (
            <Button
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ alignSelf: "center" }}
              onClick={() => router.push("/backend/dashboard")}
            >
              Backend
            </Button>
          )}
        </Stack>
        <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
          <IconButton
            variant="plain"
            color="neutral"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuRounded />
          </IconButton>
          <Drawer
            sx={{ display: { xs: "inline-flex", sm: "none" } }}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <ModalClose />
            <DialogTitle>Acme Co.</DialogTitle>
            <Box sx={{ px: 1 }}>
              <List
                size="sm"
                sx={{
                  gap: 1,
                  "--List-nestedInsetStart": "30px",
                  "--ListItem-radius": (theme) => theme.vars.radius.sm,
                }}
              >
                <ListItem>
                  <ListItemButton onClick={() => router.push("/")}>
                    <ListItemContent>
                      <Typography level="title-sm">Shop</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton
                    onClick={() => router.push("/shop/my-tickets")}
                  >
                    <ListItemContent>
                      <Typography level="title-sm">Tickets</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton
                    onClick={() => router.push("/backend/dashboard")}
                  >
                    <ListItemContent>
                      <Typography level="title-sm">Backend</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              </List>
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
          {currentUser && (
            <>
              <Tooltip title="Shopping Cart" variant="outlined">
                <Badge badgeContent={shoppingCart?.length}>
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    sx={{ alignSelf: "center" }}
                    onClick={() => router.push("/shop/my-shopping-cart")}
                  >
                    <ShoppingCart />
                  </IconButton>
                </Badge>
              </Tooltip>
              <Dropdown
                open={dropdownOpen}
                onOpenChange={(_, open) => setDropdownOpen(open)}
              >
                <MenuButton>
                  <Avatar
                    src="https://i.pravatar.cc/40?img=2"
                    srcSet="https://i.pravatar.cc/80?img=2"
                    sx={{ borderRadius: "50%" }}
                  />
                </MenuButton>
                <Menu>
                  <MenuItem>{currentUser?.username}</MenuItem>
                  <ListDivider />
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </Dropdown>
            </>
          )}
          {currentUser === null && (
            <>
              <Button
                color="neutral"
                variant="outlined"
                onClick={() => router.push("/register")}
              >
                Sign up
              </Button>
              <Button
                color="primary"
                onClick={() => router.push(`login?redirect_uri=${pathname}`)}
              >
                Sign in
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ShopHeader;
