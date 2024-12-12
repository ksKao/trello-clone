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
import { api, type RouterOutputs } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewColumnButton({
  columns,
}: {
  columns: RouterOutputs["task"]["getAllColumns"];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: addColumn, isPending } = api.task.addColumn.useMutation({
    onSuccess: async () => {
      toast({
        description: "Column added successfully",
      });
      setOpen(false);
      router.refresh();
    },
    onError: () => {
      toast({
        description:
          "Something went wrong while adding a new column. Please try again later",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Column</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new column</DialogTitle>
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
