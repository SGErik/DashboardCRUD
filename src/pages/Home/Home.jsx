import React from 'react'
import Header from '../../components/Header/Header'
import { api, getUsers, deleteUsers, getOneUser, updateUser, updatePassword } from '../../services/api'
import { Table, Button, useToaster, Message, Modal, IconButton, Form } from 'rsuite'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import "rsuite/dist/rsuite.min.css";
import { Icon } from '@rsuite/icons';
import { MdDeleteForever, MdPassword } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa"







const Home = () => {
  
  let message
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { Column, HeaderCell, Cell } = Table;
  const { isAuthenticated } = useSelector(state => state.authReducer)
  const toaster = useToaster()
  const [deleteModal, setDeleteModal] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [passwordModal, setPasswordModal] = useState(false)
  const [formEdit, setFormEdit] = useState({
    name: '',
    email: '',
  })
  const [formPass, setFormPass] = useState({
    prevPassword: '',
    password: ''
  })


  //Função que da um Get nas informações do banco de dados
  const fetchUsers = async () => {

    const response = await getUsers(isAuthenticated);


    setData(response.data.users.sort((a, b) => a.name.localeCompare(b.name)))
    setLoading(false)
  };

  //useEffect para realizar requisição assim que a página é Renderizada
  useEffect(() => {

    fetchUsers()

  }, [])






  //Função que atualiza as informações do usuário selecionado no banco de dados ao clicar no botão atualizar
  const handleUpdateUser = async (userId) => {
    await updateUser(userId, isAuthenticated, formEdit)

      .then((response) => {

        message = <Message showIcon type='success' closable>{response.data.message}</Message>

        toaster.push(message, { placement: 'topEnd', duration: 5000 })
        setUpdateModal(false)

        fetchUsers()
      })
  }





  //Função que faz a deleção do Usuário selecionado
  const handleDelete = async (id) => {

    await deleteUsers(id, isAuthenticated).then((response) => {

      setDeleteModal(false)

      message = <Message showIcon type='success' closable>{response.data.message}</Message>

      toaster.push(message, { placement: 'topEnd', duration: 5000 })

      fetchUsers()



    }).catch((error) => {

      console.log(error)

      message = <Message showIcon type='error' closable>{error.response.data.message}</Message>

      toaster.push(message, { placement: 'topEnd', duration: 5000 })


    })

  }

  //Função que faz o update da senha do usuário
  const handleUpdatePassword = async (userId) => {

    const response = await updatePassword(userId, isAuthenticated, formPass)

      .then((response) => {
      
        message = <Message showIcon type='success' closable>{response.data.message}</Message>

        toaster.push(message, { placement: 'topEnd', duration: 5000 })

        setPasswordModal(false)

        setFormPass({
          prevPassword: '',
          passoword: ''
        })

      })

      .catch((error) => {
      
        message = <Message showIcon type='error' closable>{error.response.data.message}</Message>

        toaster.push(message, { placement: 'topEnd', duration: 5000 })
      
      })

  }


  //Função que pega as informações do usuário a ser alterado ao clicar no botão de Editar Usuário
  const handleEditUser = async (userId) => {

    setSelectedUser(userId)
    const response = await getOneUser(userId, isAuthenticated)
    .then((response) => {
      
      setFormEdit({
        name: response.data.user.name,
        email: response.data.user.email
      })
      setUpdateModal(true)
    })


  }


  const handleDeleteModalOpen = (userId) => {
    setDeleteModal(true)
    setSelectedUser(userId)
  };

  
  const handlePasswordModalOpen = (userId) => {
    setPasswordModal(true)
    setSelectedUser(userId)

  }



  const handleClose = () => {
    setUpdateModal(false)
    setDeleteModal(false)
    setPasswordModal(false)
  }




  return (

    <div>
      {/* Necessário para a abertura do toaster */}
      {message}

      <Header />
      <Table
        loading={loading}
        height={600}
        data={data}
      >

        <Column width={300} align='center'>
          <HeaderCell>Nome</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={300} align='center'>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        
        <Column width={200} align='center'>
          <HeaderCell>Editar Informações</HeaderCell>

          <Cell style={{ padding: '6px' }}>
            {rowData => (
              <IconButton icon={<Icon as={FaUserEdit} />} appearance="primary" onClick={async () => handleEditUser(rowData.id)}>
              </IconButton>

            )}
          </Cell>

        </Column>
        
        
        <Column width={200} align='center'>

          <HeaderCell>Deletar Usuário</HeaderCell>
          <Cell style={{ padding: '6px' }}>
            {rowData => (

              <IconButton appearance='primary' color='red' icon={<Icon as={MdDeleteForever} />} onClick={async () => handleDeleteModalOpen(rowData.id)}></IconButton>
            )}
          </Cell>
        </Column>





        <Column width={200} align='center'>

          <HeaderCell>Editar Senha</HeaderCell>
          <Cell style={{ padding: '6px' }}>
            {rowData => (

              <IconButton appearance='primary' color='green' icon={<Icon as={MdPassword} />} onClick={async () => handlePasswordModalOpen(rowData.id)}></IconButton>
            )}



          </Cell>


        </Column>
      </Table>

      {/* Modal de Deleção de Informações */}
      <Modal open={deleteModal} onClose={handleClose} size='xs'>
        <Modal.Header>
          <Modal.Title>Deletar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja deletar este usuário?
        </Modal.Body>
        <Modal.Footer>

          <Button appearence='primary' onClick={handleClose} >Cancelar</Button>
          <Button appearance='primary' color='red' onClick={async () => handleDelete(selectedUser)}>Deletar</Button>

        </Modal.Footer>
      </Modal>


      {/* Modal de Update de Informações */}
      <Modal open={updateModal} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>Atualizar Informação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={setFormEdit} formValue={formEdit}>
            <Form.Group controlId="name-9">
              <Form.ControlLabel>Nome</Form.ControlLabel>
              <Form.Control name="name" />
              <Form.HelpText>Preencha este campo</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="email-9">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" type="email" />
              <Form.HelpText>Preencha este campo</Form.HelpText>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="subtle">
            Cancelar
          </Button>
          <Button appearance="primary" color='green' onClick={async () => handleUpdateUser(selectedUser)}>
            Atualizar
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal de troca de senha */}
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
          <Button appearance="primary" color='green' onClick={async () => handleUpdatePassword(selectedUser)}>
            Atualizar
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
  )
}

export default Home