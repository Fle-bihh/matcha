import { useAuthUser } from "@/hooks/auth.hook";

export function HomePage() {
  const { logout, authUser } = useAuthUser();
  return (
    <div
      style={{
        padding: 20,
        flexDirection: "column",
        display: "flex",
        gap: 10,
      }}
    >
      Welcome home, {authUser?.first_name} {authUser?.last_name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
