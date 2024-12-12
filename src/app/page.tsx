import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const columns = await api.task.getAllColumns();

  return (
    <HydrateClient>
      {columns.map((task) => (
        <div key={task.id}>{task.id}</div>
      ))}
    </HydrateClient>
  );
}
