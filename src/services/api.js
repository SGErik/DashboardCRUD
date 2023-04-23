import axios from 'axios'

export const api = axios.create({
    baseURL: "http://localhost:3030"
});

export const authUsers = async (email, password) => {
    return api.post('/users-auth', { email, password })
}

export const createUsers = async (formValue) => {
    return api.post('/users-create', formValue)
}

export const getUsers = async (token) => {
    return api.get('/users-list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
}

export const deleteUsers = async (id, token) => {
    return api.delete(`/users-delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

}