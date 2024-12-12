"use client";
import type { RouterOutputs } from "@/trpc/react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import NewTaskButton from "./new-task-button";
import TaskCard from "./task-card";
import { Button } from "./ui/button";

export default function Column({
  index,
  column,
  isLoading,
}: {
  index: number;
  column: RouterOutputs["task"]["getAllColumns"][number];
  isLoading: boolean;
}) {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="flex h-fit max-h-full w-80 min-w-[20rem] flex-col overflow-hidden rounded-md border bg-input pb-2 dark:border-0 dark:bg-primary-foreground"
        >
          <div className="flex items-center gap-2 p-2">
            <h2 className="max-w-full flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap p-2 font-bold">
              {column.title}
            </h2>
            <Button variant="ghost">
              <MdModeEditOutline />
            </Button>
            <Button variant="ghost">
              <MdDelete />
            </Button>
          </div>
          <Droppable
            droppableId={column.id}
            type="card"
            isDropDisabled={isLoading}
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="mt-2 max-h-[calc(100%-40px-16px)] flex-grow overflow-auto px-2"
              >
                {column.tasks.map((task, i) => (
                  <TaskCard task={task} index={i} key={task.id} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <NewTaskButton column={column} />
        </div>
      )}
    </Draggable>
  );
}
