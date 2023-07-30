import React, {useState} from 'react'
import {Button, Form, MaskedInput, Message, Modal, Toggle, useToaster} from "rsuite";
import S from "./EditUserModal.module.css";
import {updateUser} from "../../services/api.js";
import {useSelector} from "react-redux";


const EditUserModal = ({formEdit, setFormEdit, tempImage, fetchUsers ,setTempImage ,updateModal, setUpdateModal, selectedUser}) =>{
    let message
    const mask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    const storageInfo = JSON.parse(localStorage.getItem('user'))
    const toaster = useToaster()
    const [buttonLoading, setButtonLoading] = useState(false)
    const { isAuthenticated } = useSelector(state => state.authReducer)

    const handleImageEdit = async (e) => {
        const file = e.target.files[0]
        const base64Image = await convertToBase64(file)
        setFormEdit(prevState => ({
            ...prevState,
            image: base64Image
        }))
        setTempImage(base64Image)
    }

    const handleUpdateUser = async (userId) => {
        setButtonLoading(true)
        await updateUser(userId, isAuthenticated, formEdit)

            .then((response) => {

                message = <Message showIcon type='success' closable>{response.data.message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                setUpdateModal(false)
                setButtonLoading(false)
                fetchUsers()

            }).catch((error) => {
                message = <Message showIcon type='error' closable>{error.response.data.message ? error.response.data.message : error.response.data.error.errors[0].message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })

                setButtonLoading(false)
            })
    }

    const convertToBase64 = (file) => {

        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)

            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    const handleSetTelefoneEdit = (value) => {
        setFormEdit(prevState => ({
            ...prevState,
            telefone: value
        }))
    }

    const handleClose = () =>{
        setUpdateModal(false)
        setFormEdit({
            name: '',
            email: '',
            image: '',
            telefone: '',
            is_admin: false
        })
    }

    return(
        <>
            {/* Modal de Update de Informações */}
            <Modal open={updateModal} onClose={handleClose} size="xs">
                <Modal.Header>
                    <Modal.Title>Atualizar Informação</Modal.Title>
                </Modal.Header>
                <Modal.Body align='center'>
                    <img alt='avatar' src={tempImage} className={S.imageAvatar} />
                    <Form fluid onChange={setFormEdit} formValue={formEdit} align='start'>
                        <Form.Group controlId="file">
                            <Form.ControlLabel>Selecione sua foto</Form.ControlLabel>
                            <input type='file' onChange={handleImageEdit} />
                            <Form.HelpText>Arquivos suportados: JPG, PNG, JFIF e RAW</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="name">
                            <Form.ControlLabel>Nome</Form.ControlLabel>
                            <Form.Control name="name" />
                            <Form.HelpText>Preencha este campo</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control name="email" type="email" />
                            <Form.HelpText>Preencha este campo</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="telefone">
                            <Form.ControlLabel>Telefone</Form.ControlLabel>
                            <MaskedInput mask={mask} value={formEdit.telefone} onChange={handleSetTelefoneEdit} />
                            <Form.HelpText>Preencha este campo</Form.HelpText>
                        </Form.Group>
                        <div className={S.toggleDiv}>
                            Permitir como Administrador?
                            {
                                storageInfo.id === selectedUser ? <Toggle checkedChildren='Sim' unCheckedChildren='Não' checked={formEdit.is_admin} disabled /> : <Toggle checkedChildren='Sim' unCheckedChildren='Não' checked={formEdit.is_admin} onChange={async () => setFormEdit(prevState => ({
                                    ...prevState,
                                    is_admin: !formEdit.is_admin
                                }))} />
                            }

                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancelar
                    </Button>
                    <Button appearance="primary" loading={buttonLoading} color='green' onClick={async () => handleUpdateUser(selectedUser)}>
                        Atualizar
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditUserModal