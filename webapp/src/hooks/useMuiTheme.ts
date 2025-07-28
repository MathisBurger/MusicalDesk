import { useColorScheme } from "@mui/joy";
import { createTheme } from "@mui/material";

const useMuiTheme = () => {
  const { mode } = useColorScheme();
  return createTheme({
    palette: {
      mode: mode as "light" | "dark",
    },
    components: {
      MuiPopper: {
        styleOverrides: {
          root: {
            zIndex: "9999 !important",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none !important",
            border: mode === "dark" ? "2px solid #303030" : undefined,
          },
          elevation8: {
            zIndex: "9999 !important",
          },
        },
      },
    },
  });
};

export default useMuiTheme;
