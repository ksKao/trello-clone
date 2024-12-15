"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { MdDelete } from "react-icons/md";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function DeleteColumnButton({ columnId }: { columnId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: deleteColumn, isPending } = api.task.deleteColumn.useMutation(
    {
      onSuccess: () => {
        setOpen(false);
        toast.default("Column deleted successfully");
        router.refresh();
      },
      onError: (e) => {
        toast.error(e.message);
      },
    },
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <MdDelete />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Column</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this column? All tasks in this column
          will be deleted as well.
        </DialogDescription>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={isPending}
            onClick={() => deleteColumn(columnId)}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
