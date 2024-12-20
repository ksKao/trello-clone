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
import { useToast } from "@/hooks/use-toast";
import kanbanAtom from "@/lib/atoms/kanban-atom";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewColumnButton() {
  const [columns] = useAtom(kanbanAtom);

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: addColumn, isPending } = api.task.addColumn.useMutation({
    onSuccess: async () => {
      toast.default("Column added successfully");
      setOpen(false);
      setTitle("");
      router.refresh();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-[20rem] rounded-md bg-input p-2 text-center font-bold text-foreground hover:bg-primary-foreground/90 dark:bg-primary-foreground dark:hover:bg-primary-foreground/50">
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new column</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title) {
              toast.error("Title is required");
              return;
            }

            let maxOrder = columns.sort((a, b) => b.order - a.order)[0]?.order;

            if (maxOrder === undefined) maxOrder = 0;
            else maxOrder++;

            addColumn({
              title,
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
          <Button isLoading={isPending} className="mt-4 w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
