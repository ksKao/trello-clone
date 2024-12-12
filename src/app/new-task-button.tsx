"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { api, type RouterOutputs } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTaskButton({
  column,
}: {
  column: RouterOutputs["task"]["getAllColumns"][number];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: addTask, isPending } = api.task.addTask.useMutation({
    onSuccess: async () => {
      toast({
        description: "Task added successfully",
      });
      setOpen(false);
      router.refresh();
    },
    onError: () => {
      toast({
        description:
          "Something went wrong while adding a new task. Please try again later",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Add task</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title) {
              toast({
                description: "Title is required",
                variant: "destructive",
              });
              return;
            }

            let maxOrder = column.tasks.sort((a, b) => b.order - a.order)[0]
              ?.order;

            // if there is no task
            if (maxOrder === undefined) maxOrder = 0;

            // else max order is the max + 1
            maxOrder++;

            addTask({
              columnId: column.id,
              title,
              description,
              order: maxOrder,
            });
          }}
        >
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <div className="h-4" />
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="resize-none"
          />
          <Button className="mt-4 w-full" isLoading={isPending}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
