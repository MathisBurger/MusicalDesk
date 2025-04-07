"use client";
import BackButton from "@/components/back-button";
import useLoginMutation from "@/hooks/mutations/useLoginMutation";
import useUserSelfQuery from "@/hooks/queries/useUserSelfQuery";
import useAlert from "@/hooks/useAlert";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const LoginPage = () => {
  const { mutateAsync, isPending } = useLoginMutation();
  // Do not fetch on initial load
  const { refetch } = useUserSelfQuery(false);

  const { displayAlert, showAlert } = useAlert();
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (event: FormEvent<SignInFormElement>) => {
    "use client";
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    const formData = {
      username: formElements.username.value,
      password: formElements.password.value,
    };
    const loginSuccessful = await mutateAsync(formData);
    if (loginSuccessful) {
      await refetch();
      const redirect_uri = searchParams.get("redirect_uri");
      if (redirect_uri !== null && redirect_uri.startsWith("/")) {
        router.push(redirect_uri);
      } else {
        router.push("/backend/dashboard");
      }
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
              Sign in
            </Typography>
            {displayAlert()}
            <Stack sx={{ gap: 4, mt: 2 }}>
              <form onSubmit={onSubmit}>
                <FormControl required>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" name="username" disabled={isPending} />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" disabled={isPending} />
                </FormControl>
                <Link underline="always" href="/register">
                  Customer registration
                </Link>
                <Stack sx={{ gap: 4, mt: 2 }}>
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
