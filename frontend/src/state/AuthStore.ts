import { create } from "zustand";
import { isLoginInfo, LoginInfo, LoginRequest, LoginState, PasswordChangeRequest, PasswordResetInformation } from "../models/Authentication";
import { createJSONStorage, persist } from "zustand/middleware";
import { changePassword, checkLoginState, login } from "../api/api";

type AuthStore = {
    loginInfo: LoginInfo | undefined,
    loginState: LoginState,
    passwordChangeInfo: PasswordChangeRequest | undefined,
    setPasswordChangeInfo: (passwordChange: PasswordChangeRequest) => void,
    login: (loginRequest: LoginRequest) => Promise<void>,
    checkLoginState: () => Promise<void>,
    changePassword: (passwordChange: PasswordChangeRequest) => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            loginInfo: undefined,
            loginState: LoginState.LOGGED_OUT,
            passwordChangeInfo: undefined,
            setPasswordChangeInfo: (passwordChange: PasswordChangeRequest) => {
                set({ passwordChangeInfo: passwordChange })
            },
            login: async (loginRequest: LoginRequest) => {
                const response = await login(loginRequest);
                if (!response) return;
                if (isLoginInfo(response)) {
                    set({ loginInfo: response as LoginInfo, loginState: LoginState.LOGGED_IN })
                    window.location.href = import.meta.env.VITE_BASE_URL;
                } else {
                    const resetResponse = response as PasswordResetInformation
                    set({ passwordChangeInfo: { newPassword: '', user: resetResponse.user, resetCode: resetResponse.resetToken } })
                    window.location.href = `${import.meta.env.VITE_BASE_URL}change-password`
                }
            },
            checkLoginState: async () => {
                const response = await checkLoginState();
                if (response) {
                    set({ loginState: LoginState.LOGGED_IN })
                }
            },
            changePassword: async (passwordChange: PasswordChangeRequest) => {
                const response = await changePassword(passwordChange);
                if (!response) return;
                get().login({ password: passwordChange.newPassword, username: passwordChange.user })
            }
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
