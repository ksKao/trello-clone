import { api, type RouterOutputs } from "@/trpc/react";
import { Draggable } from "@hello-pangea/dnd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

export default function TaskCard({
  index,
  task,
}: {
  index: number;
  task: RouterOutputs["task"]["getAllColumns"][number]["tasks"][number];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const { mutate: editTask, isPending: isEditTaskLoading } =
    api.task.editTask.useMutation({
      onSuccess: () => {
        toast.default("Task updated successfully");
        setOpen(false);
        router.refresh();
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });
  const { mutate: deleteTask, isPending: isDeleteTaskLoading } =
    api.task.deleteTask.useMutation({
      onSuccess: () => {
        toast.default("Task deleted successfully");
        setOpen(false);
        router.refresh();
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => {
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className="mb-2 w-full rounded-md border-2 border-primary-foreground bg-primary-foreground p-2 hover:border-primary dark:border-input dark:bg-input dark:hover:border-primary"
                role="button"
              >
                <h3 className="font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="mt-2 text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Title"
                  className="mb-4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="resize-none"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="mt-4 flex gap-2">
                  <Button
                    className="flex-grow"
                    variant="destructive"
                    onClick={() => deleteTask(task.id)}
                    isLoading={isDeleteTaskLoading}
                  >
                    Delete
                  </Button>
                  <Button
                    className="flex-grow"
                    onClick={() => {
                      if (!title) {
                        toast.error("Title is required");
                        return;
                      }

                      editTask({
                        taskId: task.id,
                        newTitle: title,
                        newDescription: description,
                      });
                    }}
                    isLoading={isEditTaskLoading}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      }}
    </Draggable>
  );
}
