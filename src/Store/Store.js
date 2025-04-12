import { create } from "zustand";
import { persist } from "zustand/middleware";

export const AuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: null,
      user: null,
      token: null,
      refresh_token: null,
      setLogin: (data) => {
        set({
          token: "",
          user: data?.user,
          isAuthenticated: true,
          refresh_token: "",
          user_id: data?.user?.id,
        });
      },
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refresh_token: null,
        }),
    }),
    {
      isAuthenticated: () => {
        return !!get().acceess_token;
      },
    },
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
