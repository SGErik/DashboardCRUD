import React, {useState} from 'react'
import {Button, Form, MaskedInput, Message, Modal, Toggle, useToaster} from "rsuite";
import S from './AddModal.module.css'
import { createUsers } from "../../services/api.js";


const AddModal = ({ addModal, setAddModal, fetchUsers }) =>{
    let message
    const mask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    const toaster = useToaster()
    const [buttonLoading, setButtonLoading] = useState(false)
    const [formValue, setFormValue] = useState({
        name: '',
        email: '',
        password: '',
        confirmedPassword: '',
        image: '',
        is_admin: false,
        telefone: ''
    })

    const handleAddUser = (e) => {
        setButtonLoading(true)
        e.preventDefault()
        const response = createUsers(formValue).then((response) => {

            message = <Message showIcon type='success' closable>Usuário adicionado com sucesso!</Message>
            toaster.push(message, { placement: 'topEnd', duration: 5000 })
            setAddModal(false)
            setFormValue({
                name: '',
                email: '',
                password: '',
                confirmedPassword: '',
                image: ''
            })
            fetchUsers()
            setButtonLoading(false)

        }).catch((error) => {

            message = <Message showIcon type='error'
                               closable>{error.response.data.message ? error.response.data.message : error.response.data.error.errors[0].message}</Message>
            toaster.push(message, { placement: 'topEnd', duration: 5000 })
            setButtonLoading(false)
        })
    }


    const handleImageAdd = async (e) => {
        const file = e.target.files[0]
        const base64Image = await convertToBase64(file)
        setFormValue(prevState => ({
            ...prevState,
            image: base64Image
        }))
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

    const handleSetTelefoneAdd = (value) => {
        setFormValue(prevState => ({
            ...prevState,
            telefone: value
        }))
    }
    const handleClose = () =>{
        setAddModal(false)
    }

    return(
        <>
            {message}
            <Modal open={addModal} onClose={handleClose} size="xs">
                <Modal.Header>
                    <Modal.Title>Cadastrar usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body align={'center'}>
                    <img src={formValue.image} alt={'Avatar'} className={S.imageAvatar} />
                    <Form fluid onChange={setFormValue} formValue={formValue} align={'start'}>
                        <Form.Group controlId="file">
                            <Form.ControlLabel>Selecione a foto do usuário</Form.ControlLabel>
                            <input type='file' onChange={handleImageAdd} />
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
                            <MaskedInput mask={mask} value={formValue.telefone} onChange={handleSetTelefoneAdd} />
                            <Form.HelpText>Preencha este campo</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="password-9">
                            <Form.ControlLabel>Senha</Form.ControlLabel>
                            <Form.Control name="password" type="password" autoComplete="off" />
                            <Form.HelpText>Deve conter entre 4 e 16 caracteres</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="confirmedPassword-9">
                            <Form.ControlLabel>Confirmar Senha</Form.ControlLabel>
                            <Form.Control name="confirmedPassword" type="password" autoComplete="off" />
                            <Form.HelpText>Deve ser igual a senha escrita acima</Form.HelpText>
                        </Form.Group>
                        <div className={S.toggleDiv}>
                            Este usuário é um administrador?
                            <Toggle checkedChildren='Sim' unCheckedChildren='Não' checked={formValue.is_admin} onChange={async () => setFormValue(prevState => ({
                                ...prevState,
                                is_admin: !formValue.is_admin
                            }))} />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancelar
                    </Button>
                    <Button appearance="primary" color={"green"} loading={buttonLoading} onClick={handleAddUser}>
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddModal