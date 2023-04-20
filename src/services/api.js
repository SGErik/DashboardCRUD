import axios from 'axios'

export const api = axios.create({
    baseURL: "http://localhost:3030"   
});

export const authUsers = async (email, password) => {
    return api.post('/users-auth', {email, password})
}

export const createUsers = async (formValue) => {
    return api.post('/users-create', formValue )
}