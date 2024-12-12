"use client";
import type { RouterOutputs } from "@/trpc/react";
import NewTaskButton from "./new-task-button";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./task-card";

export default function Column({
  index,
  column,
}: {
  index: number;
  column: RouterOutputs["task"]["getAllColumns"][number];
}) {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="w-72 bg-gray-600 p-4"
        >
          <span>{column.name}</span>
          <Droppable
            droppableId={column.id}
            type="card"
            // isDropDisabled={isLoading}
          >
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {column.tasks.map((task, i) => (
                  <TaskCard task={task} index={i} key={task.id} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div>
            <NewTaskButton columnId={column.id} />
          </div>
        </div>
      )}
    </Draggable>
  );
}
