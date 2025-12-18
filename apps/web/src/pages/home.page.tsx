import { useAuthUser } from "@/hooks/auth.hook";

export function HomePage() {
  const { logout, authUser } = useAuthUser();
  return <div style={{}}></div>;
}
