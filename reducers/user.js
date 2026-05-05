import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        first_name: "",
        last_name: "",
        email: "",
        jwtToken: "",
        bookmarks: [],
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value = action.payload
        },
        logout: (state, action) => {
            state.value = {
                first_name: "",
                last_name: "",
                email: "",
                jwtToken: "",
                bookmarks: [],
            }
        },
        addBookmark: (state, action) => {
            state.value.bookmarks.push(action.payload)
        },
        removeBookmark: (state, action) => {
            state.value.bookmarks = state.value.bookmarks.filter(e => e !== action.payload)
        },
        changeUserInfos: (state, action) => {
            state.value.first_name = action.payload.firstName
            state.value.last_name = action.payload.lastName
            state.value.email = action.payload.email
        },
    }
})

export const { login, logout, addBookmark, removeBookmark, changeUserInfos } = userSlice.actions
export default userSlice.reducer