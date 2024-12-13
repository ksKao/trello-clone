import { api, HydrateClient } from "@/trpc/server";
import { getCurrentSession } from "@/lib/auth";
import Kanban from "@/components/kanban";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";

export default async function Home() {
  const { user } = await getCurrentSession();

  if (!user) redirect("/login");

  const columns = await api.task.getAllColumns();

  return (
    <HydrateClient>
      <Navbar user={user} />
      <Kanban columns={columns} />
    </HydrateClient>
  );
}
