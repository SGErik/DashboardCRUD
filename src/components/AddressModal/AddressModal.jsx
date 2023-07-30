import React, {useEffect, useState} from 'react'
import {Button, Form, Message, Modal} from "rsuite";
import { useToaster } from "rsuite";
import {getUserAddress, receiveCep, registerAddress, updateAddress} from "../../services/api.js";

const AddressModal = ({ addressModal, setAddressModal, selectedUser, emptyAddress, addressId, setAddressId, addressInfo, setAddressInfo}) => {
    let message
    const [buttonLoading, setButtonLoading] = useState(false)
    const toaster = useToaster()

    async function handleAddressRegister(userId) {
        setButtonLoading(true)
        const response = await registerAddress(userId, addressInfo)
            .then((response) => {
                message = <Message showIcon type='success' closable>{response.data.message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })

                setButtonLoading(false)
                setAddressModal(false)
            })
            .catch((error) => {
                setButtonLoading(false)
                console.log(error)
                message = <Message showIcon type='error' closable>Ocorreu um erro na requisição</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                console.log(error)
            })
    }
    async function handleAddressUpdate() {
        setButtonLoading(true)
        const response = await updateAddress(addressId, addressInfo)
            .then((response) => {
                message = <Message showIcon type='success' closable>{response.data.message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                setButtonLoading(false)
                setAddressInfo({
                    zipcode: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    street: '',
                    addressNumber: '',
                    complement: ''
                })
                setAddressModal(false)
                setAddressId('')

            })
            .catch((error) => {
                console.log(error)
                message = <Message showIcon type='error' closable>Ocorreu um erro na requisição</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                setButtonLoading(false)

            })
    }

    async function getCep() {
        const response = await receiveCep(addressInfo.zipcode)
            .then((response) => {
                setAddressInfo(prevState => ({
                    ...prevState,
                    neighborhood: response.data.sendCep.neighborhood,
                    city: response.data.sendCep.city,
                    state: response.data.sendCep.state,
                    street: response.data.sendCep.street
                }))
            }).catch((e) => {
                console.log(e)
            })
    }

    const handleClose = () => {
        setAddressModal(false)
        setAddressInfo({
            zipcode: '',
            neighborhood: '',
            city: '',
            state: '',
            street: '',
            addressNumber: '',
            complement: ''
        })
    }

    return (
        <div>
            {message}
            <Modal open={addressModal} onClose={handleClose} size="xs">
                <Modal.Header>
                    <Modal.Title>{emptyAddress ? 'Cadastrar endereço' : 'Atualizar endereço'}</Modal.Title>
                </Modal.Header>
                <Modal.Body align={'center'}>
                    <Form fluid onChange={setAddressInfo} formValue={addressInfo} align={'start'}>
                        <Form.Group controlId="zipcode">
                            <Form.ControlLabel>Cep</Form.ControlLabel>
                            <Form.Control name="zipcode" onBlur={async () => getCep()} />
                            <Form.HelpText>Preencha este campo</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="street">
                            <Form.ControlLabel >Rua</Form.ControlLabel>
                            <Form.Control name="street" disabled />

                        </Form.Group>
                        <Form.Group controlId="addressNumber">
                            <Form.ControlLabel>Número</Form.ControlLabel>
                            <Form.Control name="addressNumber" />
                        </Form.Group>
                        <Form.Group controlId="complement">
                            <Form.ControlLabel>Complemento</Form.ControlLabel>
                            <Form.Control name="complement" />
                        </Form.Group>
                        <Form.Group controlId="city">
                            <Form.ControlLabel>Cidade</Form.ControlLabel>
                            <Form.Control name="city" disabled />
                        </Form.Group>
                        <Form.Group controlId="state">
                            <Form.ControlLabel >Estado</Form.ControlLabel>
                            <Form.Control name="city" disabled />
                        </Form.Group>
                        <Form.Group controlId="neighborhood">
                            <Form.ControlLabel>Bairro</Form.ControlLabel>
                            <Form.Control name="neighborhood" disabled />
                        </Form.Group>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancelar
                    </Button>
                    {emptyAddress ? <Button appearance="primary" color={"green"} loading={buttonLoading} onClick={async () => handleAddressRegister(selectedUser)}>
                        Cadastrar
                    </Button> : <Button appearance="primary" color={"green"} loading={buttonLoading} onClick={async () => handleAddressUpdate()}>
                        Atualizar
                    </Button>}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AddressModal
