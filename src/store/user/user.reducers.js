const initialState = {
    isAuthenticated: localStorage.getItem('token') || null
}

const authReducer = (state = initialState, action) => {

    switch(action.type){
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: null

            };
        default:
            return state

    }
}

export default authReducer;