import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { Grid, Row, Col, Input, Divider, Button, useToaster, Message, Modal, Form } from "rsuite";
import Header from "../../components/Header/Header.jsx";
import { getOneUser, receiveCep, registerAddress, getUserAddress, updateAddress, updateUser, updatePassword } from '../../services/api.js';
import S from "./Dashboard.module.css";




const Dashboard = () => {
    let message
    const [openModal, setOpenModal] = useState(false)
    const storageInfo = JSON.parse(localStorage.getItem('user'))
    const { isAdmin } = useSelector(state => state.authReducer)
    const { isAuthenticated } = useSelector(state => state.authReducer)
    const adminInfo = JSON.parse(localStorage.getItem('isadmin'))
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const [user, setUser] = useState({
        name: '',
        email: '',
        image: '',
        telefone: '',

    })
    const [addressInfo, setAddressInfo] = useState({
        zipcode: '',
        neighborhood: '',
        city: '',
        state: '',
        street: '',
        addressNumber: '',
        complement: ''

    })
    const [passwordInfo, setPasswordInfo] = useState({
        prevPassword: '',
        password: '',
        confirmPass: ''
    })
    const [addressId, setAddressId] = useState('')
    const [emptyAddress, setEmptyAddress] = useState(false)
    const [onLoading, setOnLoading] = useState(false)
    const toaster = useToaster()

    function handleGetUser() {
        const response = getOneUser(userInfo.id, isAuthenticated)
            .then((response) => {
                setUser({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    image: response.data.user.url,
                    telefone: response.data.user.telefone

                })
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

    async function handleAddressInfo() {
        const response = await getUserAddress(storageInfo.id)
            .then((response) => {

                if (response.data.addresses.length === 0) {
                    setEmptyAddress(true)
                } else {
                    setEmptyAddress(false)
                    setAddressInfo({
                        zipcode: response.data.addresses[0].zipcode,
                        addressNumber: response.data.addresses[0].addressNumber,
                        neighborhood: response.data.addresses[0].neighborhood.neighborhood,
                        city: response.data.addresses[0].neighborhood.city.city,
                        state: response.data.addresses[0].neighborhood.city.state.state,
                        complement: response.data.addresses[0].complement,
                        street: response.data.addresses[0].street
                    })
                    setAddressId(response.data.addresses[0].id.toString())

                }

            })
            .catch((error) => {
                console.log(error)
            })

    }

    async function addressRegister() {
        setOnLoading(true)
        const response = await registerAddress(storageInfo.id, addressInfo)
            .then((response) => {
                message = <Message showIcon type='success' closable>{response.data.message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                setOnLoading(false)
                setOpenModal(false)
                handleAddressInfo()
            })
            .catch((error) => {
                setOnLoading(false)
                message = <Message showIcon type='error' closable>Ocorreu um erro na requisição</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                console.log(error)
            })
    }

    async function handleAddressUpdate() {
        setOnLoading(true)
        const response = await updateAddress(addressId, addressInfo)
            .then((response) => {
                message = <Message showIcon type='success' closable>{response.data.message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                setOnLoading(false)
                handleAddressInfo()
            })
            .catch((error) => {
                message = <Message showIcon type='error' closable>Ocorreu um erro na requisição</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                setOnLoading(false)
            })
    }

    const handleUpdateUser = async () => {
        setOnLoading(true)
        const response = await updateUser(storageInfo.id, isAuthenticated, user)

            .then((response) => {

                message = <Message showIcon type='success' closable>{response.data.message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })

                setOnLoading(false)



            }).catch((error) => {
                console.log(error)
                message = <Message showIcon type='error' closable>{error.response.data.message ? error.response.data.message : error.response.data.error.errors[0].message}</Message>
                toaster.push(message, { placement: 'topEnd', duration: 5000 })
                setOnLoading(false)


            })
    }

    const handleImageAdd = async (e) => {
        const file = e.target.files[0]
        const base64Image = await convertToBase64(file)
        setUser(prevState => ({
            ...prevState,
            image: base64Image
        }))


    }

    const handleUpdatePassword = async () => {
        setOnLoading(true)
        if (passwordInfo.password === passwordInfo.confirmPass) {

            const response = await updatePassword(storageInfo.id, isAuthenticated, passwordInfo)

                .then((response) => {

                    message = <Message showIcon type='success' closable>{response.data.message}</Message>
                    toaster.push(message, { placement: 'topEnd', duration: 5000 })

                    setPasswordInfo({
                        prevPassword: '',
                        password: '',
                        confirmPass: ''
                    })
                    setOnLoading(false)
                })

                .catch((error) => {

                    message = <Message showIcon type='error' closable>{error.response.data.message}</Message>
                    toaster.push(message, { placement: 'topEnd', duration: 5000 })
                    setOnLoading(false)

                })
        } else {
            message = <Message showIcon type='error' closable>Senhas não coincidem</Message>
            toaster.push(message, { placement: 'topEnd', duration: 5000 })
            setOnLoading(false)
        }

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

    useEffect(() => {
        handleGetUser()
        handleAddressInfo()
    }, [])



    function handleClose() {
        setOpenModal(false)
    }

    function handleTest() {

        console.log(emptyAddress)

    }

    function handlePasswordChange(value, property) {
        setPasswordInfo({ ...passwordInfo, [property]: value })
        console.log(passwordInfo)
    }

    function handleAddressChange(value, property) {
        setAddressInfo({ ...addressInfo, [property]: value })
    }

    function handleUserChange(value, property) {
        setUser({ ...user, [property]: value })
    }



    return (
        <div>
            {message}
            <Header userName={userInfo.name} />
            <div className={S.principalDiv}>
                <Grid fluid>
                    <div className={S.imageLabel}>
                        <img alt={'Foto do Usuário'} src={user.image} className={S.imageAvatar} />
                        <h5>Selecione sua foto</h5>
                        <input type='file' name='file' onChange={handleImageAdd} />
                    </div>
                    <div className={S.testDiv}>
                        <h3>Informações Pessoais</h3>
                    </div>
                    <Row gutter={40}>
                        <Col xs={6} sm={6} md={6}>
                            Nome <Input disabled={onLoading} value={user.name} onChange={(value) => handleUserChange(value, 'name')} ></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Email <Input disabled={onLoading} value={user.email} onChange={(value) => handleUserChange(value, 'email')}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Telefone <Input disabled={onLoading} value={user.telefone} onChange={(value) => handleUserChange(value, 'telefone')}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Senha Antiga <Input type='password' disabled={onLoading} value={passwordInfo.prevPassword} onChange={(value) => handlePasswordChange(value, 'prevPassword')}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Nova Senha <Input type='password' disabled={onLoading} value={passwordInfo.password} onChange={(value) => handlePasswordChange(value, 'password')}></Input>
                        </Col>

                        <Col xs={6} sm={6} md={6}>
                            Confirmar Nova Senha <Input type='password' disabled={onLoading} value={passwordInfo.confirmPass} onChange={(value) => handlePasswordChange(value, 'confirmPass')}></Input>
                        </Col>
                        <div className={S.buttonUser}>
                            <Button appearance="primary" loading={onLoading} onClick={async () => handleUpdatePassword()}>Salvar</Button>
                            <div className={S.buttonUser2}>
                                <Button appearance="primary" loading={onLoading} onClick={async () => handleGetUser()}>Cancelar</Button>
                            </div>

                        </div>
                    </Row>
                </Grid>
                <Divider />
                {emptyAddress ? <div className={S.emptyAddressDiv}>
                    <h4>Você não possui endereço cadastrado</h4>
                    <Button appearance='primary' onClick={async () => setOpenModal(true)}>Cadastrar endereço</Button>
                </div> : <Grid fluid>
                    <div className={S.testDiv}>
                        <h3>Endereço</h3>
                    </div>
                    <Row>
                        <Col xs={6} sm={6} md={6}>
                            Cep <Input name='cep' disabled={onLoading} onBlur={async () => getCep()} onChange={(value) => handleAddressChange(value, 'zipcode')} value={addressInfo.zipcode}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Rua <Input disabled value={addressInfo.street}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Bairro <Input disabled value={addressInfo.neighborhood}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Cidade <Input disabled value={addressInfo.city}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Estado <Input disabled value={addressInfo.state} ></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Número <Input value={addressInfo.addressNumber} disabled={onLoading} onChange={(value) => handleAddressChange(value, 'addressNumber')}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Complemento <Input value={addressInfo.complement} disabled={onLoading} onChange={(value) => handleAddressChange(value, 'complement')}></Input>
                        </Col>

                        <Col xs={6} sm={6} md={6}>
                            <div className={S.buttonDiv}>
                                <Button appearance="primary" loading={onLoading} onClick={async () => handleAddressUpdate()}>Salvar</Button>
                            </div>
                        </Col>

                    </Row>
                </Grid>}

            </div>

            <Modal open={openModal} onClose={handleClose} size="xs">
                <Modal.Header>
                    <Modal.Title>Cadastrar endereço</Modal.Title>
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
                    <Button appearance="primary" color={"green"} loading={onLoading} onClick={async () => addressRegister()}>
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default Dashboard
