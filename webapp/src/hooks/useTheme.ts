import { extendTheme } from "@mui/joy";

const theme = extendTheme({
  components: {
    JoyModal: {
      styleOverrides: {
        root: {
          zIndex: 9999,
        },
      },
    },
    JoySelect: {
      styleOverrides: {
        listbox: {
          zIndex: 9997,
        },
      },
    },
    JoyMenu: {
      styleOverrides: {
        root: {
          zIndex: 9997,
        },
      },
    },
  },
});

const useTheme = () => theme;

export default useTheme;
