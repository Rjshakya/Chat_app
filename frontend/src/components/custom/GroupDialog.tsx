import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import SearchComponent from "./SearchComponent";
import { Input } from "../ui/input";
import { useAuthStore } from "@/store/authStore";
import { handle_create_new_group } from "@/services/group/handle.group";
export interface IGroupUser {
  _id: string;
  name?: string;
  email?: string;
  username?:string
}

export const GroupDialog = () => {
  const [selected_list, setSelected_list] = useState<IGroupUser[]>([]);
  const [title, setTitle] = useState("");
  const { user } = useAuthStore((s) => s);

  const handle_create_group = async (userLists: IGroupUser[]) => {
    if (!userLists || userLists.length < 1) return;
    if (!title && !user) return;
    let copyArr: IGroupUser[] = [...userLists, { _id: user?._id! }];

    handle_create_new_group(user?._id!, copyArr, title);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          New group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group</DialogTitle>
          <DialogDescription>
            search for a friend to add to group
          </DialogDescription>
        </DialogHeader>
        <SearchComponent
          selected_list={selected_list}
          setSelected_list={setSelected_list}
          forModal={true}
        />
        <div className="input-wrapper">
          <Input
            className="rounded-full"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </div>
        <div className=" w-full flex justify-end px-5">
          <Button
            onClick={() => handle_create_group(selected_list)}
            className=" rounded-full "
            size={"lg"}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
