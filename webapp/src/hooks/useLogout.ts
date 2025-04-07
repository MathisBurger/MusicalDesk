import { useRouter } from "next/navigation";

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "DELETE",
      credentials: "include",
    });
    router.push("/");
    window.location.reload();
  };

  return logout;
};

export default useLogout;
