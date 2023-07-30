import React, {useState} from 'react'
import {Button, Form, Message, Modal, useToaster} from "rsuite";
import {updatePassword} from "../../services/api.js";
import {useSelector} from "react-redux";


const PasswordModal = ({passwordModal, setPasswordModal, selectedUser}) =>{
    let message
    const [buttonLoading, setButtonLoading] = useState(false)
    const { isAuthenticated } = useSelector(state => state.authReducer)
    const toaster = useToaster()
    const [formPass, setFormPass] = useState({
        prevPassword: '',
        password: ''
    })

    const handleUpdatePassword = async () => {
        setButtonLoading(true)
        const response = await updatePassword(selectedUser, isAuthenticated, formPass)

            .then((response) => {
                message = <Message showIcon type='success' closable>{response.data.message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })

                setPasswordModal(false)
                setFormPass({
                    prevPassword: '',
                    password: ''
                })
                setButtonLoading(false)
            })

            .catch((error) => {

                message = <Message showIcon type='error' closable>{error.response.data.message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                setButtonLoading(false)

            })

    }
    const handleClose = () =>{
        setPasswordModal(false)
        setFormPass({
            prevPassword: '',
            password: ''
        })
    }

    return (
        <>
            {message}
            <Modal open={passwordModal} onClose={handleClose} size='xs'>
                <Modal.Header>
                    <Modal.Title>Trocar Senha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={setFormPass} formValue={formPass}>
                        <Form.Group controlId="prevPassword-9">
                            <Form.ControlLabel>Senha Antiga</Form.ControlLabel>
                            <Form.Control name="prevPassword" />
                            <Form.HelpText>Preencha este campo</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="password-9">
                            <Form.ControlLabel>Nova Senha</Form.ControlLabel>
                            <Form.Control name="password" type="password" />
                            <Form.HelpText>Preencha este campo</Form.HelpText>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancelar
                    </Button>
                    <Button appearance="primary" color='green' loading={buttonLoading} onClick={async () => handleUpdatePassword()}>
                        Atualizar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default PasswordModal