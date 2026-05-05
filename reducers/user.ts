import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
    first_name: string,
    last_name: string,
    email: string,
    jwtToken: string,
    bookmarks: string[],
    _id: string
}

export type UserState = {
    value: User
}

type UpdateUserInfosPayload = {
    first_name: string
    last_name: string
    email: string
}

const initialState: UserState = {
    value: {
        first_name: "",
        last_name: "",
        email: "",
        jwtToken: "",
        bookmarks: [],
        _id: "",
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state: UserState, action: PayloadAction<User>) => {
            state.value = action.payload
        },
        logout: (state: UserState) => {
            state.value = { ...initialState.value }
        },
        addBookmark: (state, action: PayloadAction<string>) => {
            state.value.bookmarks.push(action.payload)
        },
        removeBookmark: (state, action: PayloadAction<string>) => {
            state.value.bookmarks = state.value.bookmarks.filter(e => e !== action.payload)
        },
        changeUserInfos: (state, action: PayloadAction<UpdateUserInfosPayload>) => {
            Object.assign(state.value, action.payload)
        },
    }
})

export const { login, logout, addBookmark, removeBookmark, changeUserInfos } = userSlice.actions
export default userSlice.reducer