import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
    isConnected : boolean,
    hasToken : boolean,
    first_name: string,
    last_name: string,
    email: string,
    is_admin: boolean,
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
        isConnected : false,
        hasToken : false,
        first_name: "",
        last_name: "",
        email: "",
        is_admin : false,
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
        logout: (state: UserState, action: PayloadAction<boolean | undefined>) => {
            state.value = { ...initialState.value }
            state.value.hasToken = action?.payload ?? true
        },
        clearHasToken: (state: UserState) => {
            state.value.hasToken = false
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

export const { login, logout, clearHasToken, addBookmark, removeBookmark, changeUserInfos } = userSlice.actions
export default userSlice.reducer