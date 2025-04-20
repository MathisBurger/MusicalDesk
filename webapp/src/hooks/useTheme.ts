import { extendTheme } from "@mui/joy";

const theme = extendTheme({
  components: {
    JoyModal: {
      styleOverrides: {
        root: {
          zIndex: 9997,
        },
      },
    },
    JoySelect: {
      styleOverrides: {
        listbox: {
          zIndex: 9998,
        },
      },
    },
    JoyMenu: {
      styleOverrides: {
        root: {
          zIndex: 9998,
        },
      },
    },
  },
});

const useTheme = () => theme;

export default useTheme;
