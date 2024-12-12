import { api, HydrateClient } from "@/trpc/server";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import NewTaskButton from "./new-task-button";

export default async function Home() {
  const columns = await api.task.getAllColumns();

  return (
    <HydrateClient>
      {columns.map((column) => (
        <div key={column.id}>{column.name}</div>
      ))}
      <NewTaskButton />
    </HydrateClient>
  );
}
