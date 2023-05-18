import React from 'react'
import { useSelector } from "react-redux";
import {Grid, Row, Col, Input, Divider} from "rsuite";
import Header from "../../components/Header/Header.jsx";
import S from "./Dashboard.module.css"



const Dashboard = () => {
  const { isAdmin } = useSelector(state => state.authReducer)
    const adminInfo = JSON.parse(localStorage.getItem('isadmin'))

    function handleTest(){
        console.log(`O isAdmin é ${isAdmin} e uma ${typeof isAdmin}` )
      console.log(`o adminInfo é ${adminInfo}`)

    }

  return (
    <div>
      <Header/>
        <div className={S.principalDiv}>
        <Grid fluid>
            <img alt={'Foto do Usuário'} className={S.imageAvatar}/>
            <Row gutter={40}>
                <Col xs={6} sm={6} md={6}>
                    Nome <Input></Input>
                </Col>
                <Col xs={6} sm={6} md={6}>
                    Email <Input></Input>
                </Col>
                <Col xs={6} sm={6} md={6}>
                    Telefone <Input></Input>
                </Col>
                <Col xs={6} sm={6} md={6}>
                    Senha <Input></Input>
                </Col>
                <Col xs={7} sm={7} md={7}>
                    Confirmar Senha <Input></Input>
                </Col>
            </Row>
        </Grid>
            <Divider />
            <Grid fluid>
                <h3>Endereço</h3>
                <Row>
                    <Col xs={6} sm={6} md={6}>
                        Bairro <Input></Input>
                    </Col>
                    <Col xs={6} sm={6} md={6}>
                        Endereço <Input></Input>
                    </Col>
                </Row>
            </Grid>
        </div>
    </div>

  )
}

export default Dashboard
