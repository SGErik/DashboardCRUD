import React, { useContext } from 'react'
import { Nav, Navbar } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import "rsuite/dist/rsuite.min.css";
import S from './Header.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/user/user.actions';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@rsuite/icons';
import  {FaAddressBook}  from 'react-icons/fa';




const Header = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.authReducer)

  const handleLogout = () => {


    dispatch(logout())
    localStorage.clear()
    navigate('/login')

  }

  const handleState = () => {
    console.log(isAuthenticated)
  }


  return (
    
      <Navbar>
        <Navbar.Brand href="/home">Dashboard</Navbar.Brand>
        <Nav>
          <Nav.Item icon={<Icon as={FaAddressBook} size="1.5em"/>}>Lista de Usuários</Nav.Item>
        </Nav>
        <Nav pullRight>
          <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
        </Nav>
      </Navbar>
    
  )
}

export default Header