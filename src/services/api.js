import axios from 'axios'

export const api = axios.create({
    baseURL: "http://localhost:3030/"
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

export const updateUser = async (id, token, formEdit) => {
    return api.put(`/users-update/${id}`, formEdit, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getOneUser = async (id, token) => {
    return api.get(`/users-find/${id}`,  {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updatePassword = async (id ,token, formPass) => {
    return api.put(`/users-updatepass/${id}`, formPass, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}