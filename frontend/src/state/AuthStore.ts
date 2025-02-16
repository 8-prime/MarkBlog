// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
// import { LoginRequest, LoginState } from '../models/Authentication'

import { create } from "zustand";
import { isLoginInfo, LoginInfo, LoginRequest, LoginState } from "../models/Authentication";
import { createJSONStorage, persist } from "zustand/middleware";
import { checkLoginState, login } from "../api/api";

type AuthStore = {
    loginInfo: LoginInfo | undefined,
    loginState: LoginState,
    login: (loginRequest: LoginRequest) => Promise<void>,
    checkLoginState: () => Promise<void>,

}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, _) => ({
            loginInfo: undefined,
            loginState: LoginState.LOGGED_OUT,
            login: async (loginRequest: LoginRequest) => {
                console.log("called login");

                const response = await login(loginRequest);
                if (!response) return;
                if (isLoginInfo(response)) {
                    set({ loginInfo: response as LoginInfo, loginState: LoginState.LOGGED_IN })
                    window.location.href = '/';
                } else {
                    window.location.href = '/change-password'
                }
            },
            checkLoginState: async () => {
                const response = await checkLoginState();
                if (response) {
                    set({ loginState: LoginState.LOGGED_IN })
                }
            },
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
