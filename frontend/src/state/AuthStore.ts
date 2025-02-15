// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
// import { LoginRequest, LoginState } from '../models/Authentication'

type AuthStore = {
    loginInfo: LoginInfo | undefined,
    loginState: LoginState,
    login: (loginRequest: LoginRequest) => Promise<void>,
    checkLoginState: () => Promise<void>,

}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
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
                    Navigate({ to: '/change-password' })
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


import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { isLoginInfo, LoginInfo, LoginRequest, LoginState } from '../models/Authentication'
import { checkLoginState, login, updateArticle } from '../api/api';
import { Navigate } from 'react-router';

type BearStore = {
    bears: number
    addABear: () => void,
    setBear: (update: number) => void,
    reset: () => void
}

export const useBearStore = create<BearStore>()(
    persist(
        (set, get) => ({
            bears: 0,
            addABear: () => set({ bears: get().bears + 1 }),
            setBear: (update: number) => set({ bears: update }),
            reset: () => set({ bears: 0 })
        }),
        {
            name: 'food-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)