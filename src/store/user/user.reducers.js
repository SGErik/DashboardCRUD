
const adminInfo = JSON.parse(localStorage.getItem('isadmin'))

const initialState = {
    isAuthenticated: localStorage.getItem('token') || null,
    isAdmin: JSON.parse(localStorage.getItem('isadmin'))
}

const authReducer = (state = initialState, action) => {

    switch(action.type){
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: action.isAuthenticated,
                isAdmin: action.isAdmin

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