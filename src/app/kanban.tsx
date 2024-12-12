"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import {
  DragDropContext,
  Droppable,
  type OnDragEndResponder,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import Column from "./column";
import NewColumnButton from "./new-column-button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function Kanban({
  columns,
}: {
  columns: RouterOutputs["task"]["getAllColumns"];
}) {
  const router = useRouter();
  const [orderedData, setOrderedData] = useState(columns);
  const { mutate: sortColumn, isPending: isSortColumnLoading } =
    api.task.sortColumn.useMutation({
      onSuccess: () => {
        toast({
          description: "Column order updated successfully",
        });
      },
      onError: () => {
        toast({
          description: "Something went wrong while trying to sort the column",
          variant: "destructive",
        });
      },
      onSettled: () => {
        router.refresh();
      },
    });
  const { mutate: updateTaskOrder, isPending: isMoveTaskLoading } =
    api.task.updateTaskOrder.useMutation({
      onSuccess: () => {
        toast({
          description: "Task moved successfully",
        });
      },
      onError: () => {
        toast({
          description: "Something went wrong while trying to move the task",
          variant: "destructive",
        });
      },
      onSettled: () => {
        router.refresh();
      },
    });

  useEffect(() => {
    setOrderedData(columns);
  }, [columns]);

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (removed) result.splice(endIndex, 0, removed);

    return result;
  }

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // user moves a column
    if (type === "column") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          sortOrder: index,
        }),
      );
      setOrderedData(items);
      sortColumn(
        items.map((i) => {
          return { ...i };
        }),
      );
    }

    if (type === "card") {
      const newOrderedData = [...orderedData];

      const sourceColumn = newOrderedData.find(
        (c) => c.id === source.droppableId,
      );
      const destColumn = newOrderedData.find(
        (c) => c.id === destination.droppableId,
      );

      if (!sourceColumn || !destColumn) return;

      // Moving the card in the same column
      if (source.droppableId === destination.droppableId) {
        const reorderedTasks = reorder(
          sourceColumn.tasks,
          source.index,
          destination.index,
        );

        reorderedTasks.forEach((card, i) => {
          card.order = i;
        });

        sourceColumn.tasks = reorderedTasks;

        setOrderedData(newOrderedData);
        updateTaskOrder(
          reorderedTasks.map((t) => {
            return {
              ...t,
            };
          }),
        );
      } else {
        // Moving card to a different column
        // Remove card from source column
        const [movedCard] = sourceColumn.tasks.splice(source.index, 1);

        if (!movedCard) return;

        // Assign the new column ID to the moved card
        movedCard.columnId = destination.droppableId;

        // Add card to the destination column
        destColumn.tasks.splice(destination.index, 0, movedCard);

        sourceColumn.tasks.forEach((task, i) => {
          task.order = i;
        });

        destColumn.tasks.forEach((task, i) => {
          task.order = i;
        });

        setOrderedData(newOrderedData);
        updateTaskOrder([
          ...sourceColumn.tasks.map((t) => {
            return {
              ...t,
            };
          }),
          ...destColumn.tasks.map((t) => {
            return {
              ...t,
            };
          }),
        ]);
      }
    }
  };

  return (
    <div
      className={`flex gap-4 ${isMoveTaskLoading || isSortColumnLoading ? "opacity-80" : ""}`}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" type="column" direction="horizontal">
          {(provided) => (
            <div
              className="flex h-full max-h-[calc(100%-2rem)] w-fit gap-x-3 pr-8 pt-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {orderedData.map((c, i) => (
                <Column
                  key={c.id}
                  index={i}
                  column={c}
                  isLoading={isMoveTaskLoading || isSortColumnLoading}
                />
              ))}
              {provided.placeholder}
              <NewColumnButton columns={columns} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
