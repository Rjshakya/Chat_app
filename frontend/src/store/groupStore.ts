import { create } from "zustand";
import { useAuthStore, type user } from "./authStore";

export interface IGroup {
  _id: string;
  title: string;
  members: string[];
  admin: string;
  picture:string
}

interface IGroupStore {
  user: user | null;
  groups: IGroup[] | [];
  group:IGroup|null
  addNewGroup: (group: IGroup) => void;
  // getGroup:(groupID:string) => void
}

const useGroupStore = create<IGroupStore>((set, get) => ({
  user: useAuthStore.getState().user,
  groups: [],
  group:null,
  addNewGroup: (group) => {
    let copyArr = [...get().groups];
    copyArr.push(group);
    set({ groups: copyArr });
  },

}));

export default useGroupStore
