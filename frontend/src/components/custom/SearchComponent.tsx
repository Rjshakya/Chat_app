import { useCallback, useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import useDebounce from "@/hooks/use.debounce";
import { searchUSer } from "@/services/user/user.details";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import {
  handle_create_new_chat,
  handle_save_in_recent_chat,
} from "@/services/chat/chat.service";
import { useAuthStore } from "@/store/authStore";
import type { UserObj } from "@/store/usersStore";
import useChatStore from "@/store/chatStore";
import { socket_services } from "@/lib/socket";
import H1 from "../typography/H1";
import { P } from "../typography/P";
import type { IGroupUser } from "./GroupDialog";
import type { IChat } from "./ChatUI";

const SearchComponent = ({
  forModal,
  selected_list,
  setSelected_list,
}: {
  forModal: boolean;
  selected_list?: IGroupUser[];
  setSelected_list?: React.Dispatch<React.SetStateAction<IGroupUser[]>>;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchRes, setSearchRes] = useState<UserObj[]>([]);
  const sv = useDebounce(searchInput, 1200);
  const navigate = useNavigate();
  const { user } = useAuthStore((s) => s);

  const handleSearchInput = (val: string) => {
    setShowModal(true);
    setSearchInput(val);
  };

  const handle_card_click = async (
    senderId: string,
    receiverId: string,
    u: UserObj
  ) => {
    try {
      const chat: IChat = await handle_create_new_chat(senderId, receiverId);
      useChatStore.setState({ receiver: u });

      socket_services.ev_join_chat({
        id: chat?._id,
        sender: senderId,
        receiver: receiverId,
      });

      handle_save_in_recent_chat(chat?._id, senderId, receiverId, user?._id!);

      navigate(`/dashboard?chat=${chat?._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handle_card_click_forModal = useCallback(
    (user: IGroupUser) => {
      if (!user && !selected_list && !setSelected_list) return;

      if (selected_list?.includes(user)) return;
      let copyArr = [...selected_list!];
      copyArr.push(user);
      setSelected_list && setSelected_list(copyArr);
    },
    [selected_list, setSelected_list]
  );

  const handle_unSelect = useCallback(
    (user: IGroupUser) => {
      if (!user) return;
      let copyArr = [...selected_list!].filter((u) => u?._id !== user?._id);
      setSelected_list && setSelected_list(copyArr);
    },
    [selected_list, setSelected_list]
  );

  useEffect(() => {
    const run = async () => {
      if (sv.length < 1) return;
      const res = await searchUSer(sv);
      setSearchRes(res);
    };

    run();
  }, [sv]);

  useEffect(() => {
    if (searchInput.length < 1) {
      setShowModal(false);
    }
  }, [searchInput]);

  return (
    <div
      // onBlur={() => setShowModal(false)}
      className={`user search w-full  px-2 ${
        forModal || "pb-14 pt-4"
      } transition-all duration-300 ease-in-out`}
    >
      {forModal && (
        <div className=" transition-all duration-300  selected p-2 flex items-center flex-wrap w-full gap-2">
          {selected_list &&
            selected_list.length > 0 &&
            selected_list.map((u) => {
              return (
                <Card
                  className=" p-2 flex flex-row items-center gap-3"
                  key={u?._id}
                >
                  <CardTitle className=" text-sm">{u?.name}</CardTitle>
                  <Button
                    onClick={() =>
                      forModal &&
                      handle_unSelect({
                        _id: u?._id,
                      })
                    }
                    className="rounded-full size-5"
                    variant={"destructive"}
                    size={"icon"}
                  >
                    <X />
                  </Button>
                </Card>
              );
            })}
        </div>
      )}

      <div
        className={`title w-full  ${forModal || "md:mb-8 mb-2 py-4"} py-2 px-2`}
      >
        {forModal || (
          <H1
            className="md:text-8xl md:text-center text-pretty text-left"
            text="Search your mates"
          />
        )}

        {forModal && <P className="px-1" text="Search friend" />}
      </div>
      <div className="input-wrap w-full  flex justify-center relative px-1">
        <div className=" w-full flex justify-center">
          <div className="max-w-2xl w-full relative flex">
            <Input
              value={searchInput}
              onChange={(e) => handleSearchInput(e.currentTarget.value)}
              type="text"
              className=" h-16 rounded-full p-5 border-4"
            />

            {searchInput.length > 0 && (
              <div className="cancel-btn absolute top-3 right-3">
                <Button
                  onClick={() => setShowModal(false)}
                  size={"icon"}
                  variant={"outline"}
                  className=" rounded-full size-9"
                >
                  <X />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`mx-2 p-2 z-30 border-2 shadow-xl absolute ${
            showModal ? "top-18 opacity-100" : "-top-96"
          } opacity-0 transition-all duration-300 ease-in  input-dialog md:max-w-2xl max-w-lg w-full h-40 bg-muted rounded-3xl`}
        >
          <div className=" search-results-flow  w-full h-full overflow-y-auto flex flex-col gap-2 py-2 px-2">
            {searchRes.length > 0 &&
              searchRes.map((u) => {
                return (
                  <Card
                    onClick={() =>
                      forModal
                        ? handle_card_click_forModal(u)
                        : handle_card_click(user?._id!, u?._id, u)
                    }
                    key={u._id}
                    className=" bg-muted p-2"
                  >
                    <CardHeader className=" gap-0">
                      <CardTitle className=" text-sm">{u.name}</CardTitle>
                      <CardDescription className=" text-xs">
                        {u.email}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}

            {searchRes.length < 1 && (
              <Card className=" bg-muted p-2">
                <CardHeader className=" gap-0">
                  <CardTitle className=" text-sm">No user</CardTitle>
                  <CardDescription className=" text-xs">found</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
