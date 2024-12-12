import { api, HydrateClient } from "@/trpc/server";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import NewColumnButton from "./new-column-button";
import Column from "./column";

export default async function Home() {
  const columns = await api.task.getAllColumns();

  return (
    <HydrateClient>
      <div className="flex gap-4">
        {columns.map((column) => (
          <Column column={column} key={column.id} />
        ))}
        <NewColumnButton />
      </div>
    </HydrateClient>
  );
}
