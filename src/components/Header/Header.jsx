import React, { useState }from 'react'
import {Button, Form, Modal, Nav, Navbar} from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import S from './Header.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/user/user.actions';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@rsuite/icons';
import  {FaAddressBook}  from 'react-icons/fa';
import { ImExit } from "react-icons/im";
import { RxDashboard } from "react-icons/rx";
import { BsPersonPlusFill } from "react-icons/bs"




const Header = ({ onClickProp } ) => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.authReducer)
    const [logoutModal, setLogoutModal] = useState(false)

  const handleLogout = () => {

    setLogoutModal(false)
    dispatch(logout())
    localStorage.clear()
    navigate('/login')

  }

  const handleLogoutModal = () => {
    setLogoutModal(true)
  }

  const handleClose = ()=> {
      setLogoutModal(false)
  }


  return (
      <>
      <Navbar>
        <Nav>
         <Nav.Item icon={<Icon as={RxDashboard} size='1.1em'/>}>Dashboard</Nav.Item>
        </Nav>
        <Nav>
          <Nav.Item href='/home' icon={<Icon as={FaAddressBook} size="1.3em"/>}>Lista de Usuários</Nav.Item>
        </Nav>
        <Nav pullRight>
          <Nav.Item icon={<Icon as={ImExit} />} onClick={handleLogoutModal}>Logout</Nav.Item>
        </Nav>
          <Nav pullRight>
              <Nav.Item icon={<Icon as={BsPersonPlusFill}  size={"1.3em"}/>} onClick={onClickProp}>Adicionar Usuário</Nav.Item>
          </Nav>
      </Navbar>

    <Modal open={logoutModal} onClose={handleClose} size="xs">
        <Modal.Header>
            <Modal.Title>Fazer Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h6>Tem certeza que deseja sair?</h6>
        </Modal.Body>
        <Modal.Footer>
            <Button  appearance="primary" color={"red"} onClick={handleLogout}>
                Sair
            </Button>
            <Button onClick={handleClose} appearance="subtle">
                Cancelar
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}

export default Header