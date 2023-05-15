export const loginSuccess = (isAuthenticated, isAdmin) => {
    return {
        type: 'LOGIN_SUCCESS',
        isAuthenticated: isAuthenticated,
        isAdmin: isAdmin

    };

}


export const logout = () => {
    return {
        type: 'LOGOUT'

    }
}