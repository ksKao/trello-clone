import { api, HydrateClient } from "@/trpc/server";
import { getCurrentSession } from "@/lib/auth";
import Kanban from "@/components/kanban";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();

  if (!user) redirect("/login");

  const columns = await api.task.getAllColumns();

  return (
    <HydrateClient>
      <Kanban columns={columns} />
    </HydrateClient>
  );
}
