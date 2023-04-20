export const loginSucess = (payload) => {
    return {
        type: 'LOGIN_SUCCESS',
        payload: payload

    };

}


export const logout = () => {
    return {
        type: 'LOGOUT'

    }
}