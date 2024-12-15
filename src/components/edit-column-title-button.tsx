"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MdModeEditOutline } from "react-icons/md";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function EditColumnTitleButton({
  columnId,
  currentTitle,
}: {
  columnId: string;
  currentTitle: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(currentTitle);
  const [open, setOpen] = useState(false);
  const { mutate: editColumnName, isPending } =
    api.task.editColumnName.useMutation({
      onSuccess: () => {
        setOpen(false);
        toast.default("Column title updated successfully");
        router.refresh();
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <MdModeEditOutline />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Title</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title) {
              toast.error("Title is required");
              return;
            }

            editColumnName({
              columnId,
              newTitle: title,
            });
          }}
        >
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button className="mt-4 w-full" isLoading={isPending}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
