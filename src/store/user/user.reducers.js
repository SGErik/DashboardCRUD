
const adminInfo = localStorage.getItem('isadmin')

const initialState = {
    isAuthenticated: localStorage.getItem('token') || null,
    isAdmin: Boolean(localStorage.getItem('isadmin'))|| null
}

const authReducer = (state = initialState, action) => {

    switch(action.type){
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: action.isAuthenticated,
                isAdmin: Boolean(action.isAdmin)

            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: null,
                isAdmin: null

            };
        default:
            return state

    }
}

export default authReducer;