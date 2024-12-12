import type { RouterOutputs } from "@/trpc/react";
import { atom } from "jotai";

const kanbanAtom = atom<RouterOutputs["task"]["getAllColumns"]>([]);

export default kanbanAtom;
