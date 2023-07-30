import React, {useState} from 'react';
import {Button, Message, Modal, useToaster} from "rsuite";
import { deleteUsers } from "../../services/api.js";
import { useSelector } from "react-redux";

const DeleteModal = ({deleteModal, setDeleteModal, fetchUsers, selectedUser}) => {
    let message
    const toaster = useToaster()
    const [buttonLoading, setButtonLoading] = useState(false)
    const { isAuthenticated } = useSelector(state => state.authReducer)

    const handleDelete = async () => {
        setButtonLoading(true)
        await deleteUsers(selectedUser, isAuthenticated).then((response) => {

            setDeleteModal(false)

            message = <Message showIcon type='success' closable>{response.data.message}</Message>
            toaster.push(message, { placement: 'topEnd', duration: 5000 })
            setButtonLoading(false)
            fetchUsers()

        }).catch((error) => {
            console.log(error)
            message = <Message showIcon type='error' closable>{error.response.data.message}</Message>
            toaster.push(message, { placement: 'topEnd', duration: 5000 })
        })
    }

    const handleClose = () =>{
        setDeleteModal(false)
    }


    return (
        <div>
            {message}
            <Modal open={deleteModal} onClose={handleClose} size='xs'>
                <Modal.Header>
                    <Modal.Title>Deletar Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza de que deseja deletar este usuário?
                </Modal.Body>
                <Modal.Footer>
                    <Button appearence='primary' onClick={handleClose}>Cancelar</Button>
                    <Button loading={buttonLoading} appearance='primary' color='red' onClick={async () => handleDelete(selectedUser)}>Deletar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeleteModal