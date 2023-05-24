import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { Grid, Row, Col, Input, Divider, Button } from "rsuite";
import Header from "../../components/Header/Header.jsx";
import { getOneUser } from '../../services/api.js';
import S from "./Dashboard.module.css";




const Dashboard = () => {
    const { isAdmin } = useSelector(state => state.authReducer)
    const { isAuthenticated } = useSelector(state => state.authReducer)
    const adminInfo = JSON.parse(localStorage.getItem('isadmin'))
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const [user, setUser] = useState({
        name: '',
        email: '',
        image: '',
        telefone: ''


    })

    function handleGetUser() {
        const response = getOneUser(userInfo.id, isAuthenticated)
        .then((response)=> {
            setUser({
                name: response.data.user.name,
                email: response.data.user.email,
                image: response.data.user.url,
                telefone: response.data.user.telefone

            })
        })

    }

    useEffect(() => {
        handleGetUser()
    }, [])




    function handleTest() {
        handleGetUser()
    }

    return (
        <div>
            <Header userName={userInfo.name}/>
            <div className={S.principalDiv}>
                <Grid fluid>
                    <img alt={'Foto do Usuário'} src={user.image} className={S.imageAvatar} />
                    <Row gutter={40}>
                        <Col xs={6} sm={6} md={6}>
                            Nome <Input value={user.name}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Email <Input value={user.email}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Telefone <Input value={user.telefone}></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Nova Senha <Input></Input>
                        </Col>
                        <Col xs={7} sm={7} md={7}>
                            Confirmar Nova Senha <Input></Input>
                        </Col>
                    </Row>
                </Grid>
                <Divider />
                <Grid fluid>
                    <h3>Endereço</h3>
                    <Row>
                        <Col xs={6} sm={6} md={6}>
                            Cep <Input></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Bairro <Input disabled></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Cidade <Input disabled></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Estado <Input disabled></Input>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                            Uf <Input disabled ></Input>
                        </Col>
                        <Button onClick={handleTest}>Teste</Button>
                    </Row>
                </Grid>
            </div>
        </div>

    )
}

export default Dashboard
