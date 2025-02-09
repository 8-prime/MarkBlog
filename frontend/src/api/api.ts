import { LoginRequest, PasswordChangeRequest } from "../models/Authentication"

const login = (login: LoginRequest) => {
    return fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
            username: '',
            password: ''
        })
    })
}

const changePassword = (changeRequest: PasswordChangeRequest) => {
    return fetch('/api/change-password', {
        method: 'POST',
        body: JSON.stringify({
            user: '',
            resetCode: '',
            newPassword: ''
        })
    })
}

const refresh = (refreshToken: string) => {
    return fetch('/api/refresh', {
        method: 'POST',
        body: JSON.stringify({
            refreshToken: ''
        })
    })
}

const uploadImage = (image: any) => {
    return fetch('/api/images', {
        method: 'POST',
        body: JSON.stringify({
            file: ''
        })
    })
}