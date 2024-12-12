import { api, HydrateClient } from "@/trpc/server";
import Kanban from "@/components/kanban";

export default async function Home() {
  const columns = await api.task.getAllColumns();

  return (
    <HydrateClient>
      <Kanban columns={columns} />
    </HydrateClient>
  );
}
