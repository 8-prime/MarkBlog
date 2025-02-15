export type LoginRequest = {
    username: string,
    password: string
}

export type PasswordChangeRequest = {
    user: string,
    resetCode: string,
    newPassword: string
}

export type PasswordResetInformation = {
    resetToken: string,
    user: string
}

export type LoginInfo = {
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string
}

export enum LoginState {
    LOGGED_IN = 'logged_in',
    LOGGED_OUT = 'logged_out',
    LOADING = 'loading'
}

const isLoginInfo = (data: any) => {
    return 'accessToken' in data
}
export { isLoginInfo };