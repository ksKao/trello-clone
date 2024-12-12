import type { RouterOutputs } from "@/trpc/react";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({
  index,
  task,
}: {
  index: number;
  task: RouterOutputs["task"]["getAllColumns"][number]["tasks"][number];
}) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="mb-2 w-full rounded-md border-2 border-primary-foreground bg-primary-foreground p-2 hover:border-primary dark:border-input dark:bg-input dark:hover:border-primary"
            role="button"
          >
            <p className="p-4">{task.title}</p>
          </div>
        );
      }}
    </Draggable>
  );
}
