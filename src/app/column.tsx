"use client";
import type { RouterOutputs } from "@/trpc/react";
import NewTaskButton from "./new-task-button";

export default function Column({
  column,
}: {
  column: RouterOutputs["task"]["getAllColumns"][number];
}) {
  return (
    <div className="w-72 bg-gray-600 p-4">
      <span>{column.name}</span>
      <div>
        {column.tasks.map((task) => (
          <div key={task.id}>{task.title}</div>
        ))}
      </div>
      <div>
        <NewTaskButton columnId={column.id} />
      </div>
    </div>
  );
}
