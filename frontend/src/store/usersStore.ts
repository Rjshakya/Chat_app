import { create } from "zustand";

export interface UserObj {
   
    _id:string,
    name:string,
    email:string, 
    role:string
    last_LoggedIn?:number|null
    isOnline:boolean|null
    picture:string
    username?:string
  
}

export interface onlineUsersStore {
  onlineUsers:UserObj[]|[];
  handleOnlineUsers: (usersObj:UserObj[]) => void;
}

export const useOnlineUserStore = create<onlineUsersStore>((set) => ({
  onlineUsers: [],
  handleOnlineUsers: (usersObj:UserObj[]) => {
    set({
      onlineUsers: usersObj,
    });
  },
}));
