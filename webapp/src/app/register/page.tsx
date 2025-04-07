"use client";
import BackButton from "@/components/back-button";
import FormInput from "@/form/form-input";
import useForm from "@/form/useForm";
import useRegisterCustomerAccountMutation, {
  RegisterRequest,
} from "@/hooks/mutations/useRegisterCustomerAccountMutation";
import useAlert from "@/hooks/useAlert";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { mutateAsync, isPending } = useRegisterCustomerAccountMutation();
  const { displayAlert, showAlert } = useAlert();
  const router = useRouter();

  const form = useForm<RegisterRequest>({
    labels: {
      email: "Email",
      password: "Password",
    },
    required: ["email", "password"],
  });

  const submit = async (data: RegisterRequest) => {
    const registerSuccess = await mutateAsync(data);
    if (registerSuccess) {
      router.push("/login");
    } else {
      showAlert({
        color: "danger",
        content: "Invalid username or password",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          width: { xs: "100vw", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <BackButton />
            <Typography component="h1" level="h3">
              Sign up
            </Typography>
            {displayAlert()}
            <Stack sx={{ gap: 4, mt: 2 }}>
              <form onSubmit={form.onSubmit(submit)} onInput={form.onInvalid}>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <FormInput {...form.getInputProps("email")} type="email" />
                  <FormInput
                    {...form.getInputProps("password")}
                    type="password"
                  />
                  <Button type="submit" fullWidth disabled={isPending}>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          width: { xs: "0vw", md: "50vw" },
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${process.env.NEXT_PUBLIC_LOGIN_IMAGE_URL})`,
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: `url(${process.env.NEXT_PUBLIC_LOGIN_IMAGE_URL})`,
          },
        })}
      />
    </>
  );
};

export default LoginPage;
