"use client";
import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BusinessIcon from "@mui/icons-material/Business";
import ColorSchemeToggle from "./color-scheme-toggle";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Event, Money, SupervisedUserCircle } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import RoleWrapper from "./wrapper/role-wrapper";
import useLogout from "@/hooks/useLogout";
import NestedListToggler from "./nested-list-toggler";
import { UserRole } from "@/types/api/user";
import { useTranslations } from "next-intl";

function openSidebar() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--SideNavigation-slideIn", "1");
  }
}

function closeSidebar() {
  if (typeof window !== "undefined") {
    document.documentElement.style.removeProperty("--SideNavigation-slideIn");
    document.body.style.removeProperty("overflow");
  }
}

export function toggleSidebar() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--SideNavigation-slideIn");
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

export default function Sidebar() {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const logout = useLogout();
  const t = useTranslations();

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 9997,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BusinessIcon />
        </IconButton>
        <Typography level="title-lg">MusicalDesk</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton onClick={() => router.push("/backend/dashboard")}>
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">
                  {t("sidebar.dashboard")}
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <RoleWrapper roles={[UserRole.MemberAdmin]} hideAlert>
            <ListItem>
              <ListItemButton onClick={() => router.push("/backend/members")}>
                <SupervisedUserCircle />
                <ListItemContent>
                  <Typography level="title-sm">
                    {t("sidebar.members")}
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          </RoleWrapper>
          <RoleWrapper
            roles={[UserRole.EventAdmin, UserRole.TicketInvalidator]}
            hideAlert
          >
            <ListItem>
              <ListItemButton onClick={() => router.push("/backend/events")}>
                <Event />
                <ListItemContent>
                  <Typography level="title-sm">
                    {t("sidebar.events")}
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          </RoleWrapper>
          <RoleWrapper roles={[]} hideAlert>
            <ListItem>
              <ListItemButton onClick={() => router.push("/backend/users")}>
                <SupervisedUserCircle />
                <ListItemContent>
                  <Typography level="title-sm">{t("sidebar.users")}</Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          </RoleWrapper>
          <RoleWrapper
            roles={[UserRole.Accountant, UserRole.ExpenseRequestor]}
            hideAlert
          >
            <ListItem nested>
              <NestedListToggler
                title={t("sidebar.expenses.title")}
                icon={<Money />}
              >
                <RoleWrapper roles={[UserRole.Accountant]} hideAlert>
                  <ListItem>
                    <ListItemButton
                      onClick={() => router.push("/backend/expenses/dashboard")}
                    >
                      <ListItemContent>
                        <Typography level="title-sm">
                          {t("sidebar.expenses.dashboard")}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </RoleWrapper>
                <RoleWrapper roles={[UserRole.Accountant]} hideAlert>
                  <ListItem>
                    <ListItemButton
                      onClick={() => router.push("/backend/expenses/accounts")}
                    >
                      <ListItemContent>
                        <Typography level="title-sm">
                          {t("sidebar.expenses.accounts")}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </RoleWrapper>
                <RoleWrapper roles={[UserRole.Accountant]} hideAlert>
                  <ListItem>
                    <ListItemButton
                      onClick={() =>
                        router.push("/backend/expenses/categories")
                      }
                    >
                      <ListItemContent>
                        <Typography level="title-sm">
                          {t("sidebar.expenses.categories")}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </RoleWrapper>
                <RoleWrapper roles={[UserRole.Accountant]} hideAlert>
                  <ListItem>
                    <ListItemButton
                      onClick={() => router.push("/backend/expenses/budgets")}
                    >
                      <ListItemContent>
                        <Typography level="title-sm">
                          {t("sidebar.expenses.budgets")}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </RoleWrapper>
                <RoleWrapper roles={[UserRole.Accountant]} hideAlert>
                  <ListItem>
                    <ListItemButton
                      onClick={() =>
                        router.push("/backend/expenses/transactions")
                      }
                    >
                      <ListItemContent>
                        <Typography level="title-sm">
                          {t("sidebar.expenses.transactions")}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </RoleWrapper>
                <RoleWrapper
                  roles={[UserRole.Accountant, UserRole.ExpenseRequestor]}
                  hideAlert
                >
                  <ListItem>
                    <ListItemButton
                      onClick={() => router.push("/backend/expenses/expenses")}
                    >
                      <ListItemContent>
                        <Typography level="title-sm">
                          {t("sidebar.expenses.expenses")}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </RoleWrapper>
                <RoleWrapper roles={[UserRole.Accountant]} hideAlert>
                  <ListItem>
                    <ListItemButton
                      onClick={() => router.push("/backend/expenses/reports")}
                    >
                      <ListItemContent>
                        <Typography level="title-sm">
                          {t("sidebar.expenses.reports")}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </RoleWrapper>
              </NestedListToggler>
            </ListItem>
          </RoleWrapper>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar
          variant="outlined"
          size="sm"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{currentUser?.username}</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={logout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
