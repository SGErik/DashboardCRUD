import React from 'react'
import Header from '../../components/Header/Header'
import { api, getUsers, deleteUsers, getOneUser, updateUser, updatePassword, createUsers } from '../../services/api'
import { Table, Button, useToaster, Message, Modal, IconButton, Form, FlexboxGrid, Toggle } from 'rsuite'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import "rsuite/dist/rsuite.min.css";
import { Icon } from '@rsuite/icons';
import { MdDeleteForever, MdPassword } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa"
import S from './Home.module.css'







const Home = () => {

  let message
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  const {Column, HeaderCell, Cell} = Table;
  const {isAuthenticated} = useSelector(state => state.authReducer)
  const { isAdmin } = useSelector(state => state.authReducer)
  const [tempImage, setTempImage] = useState('')
  const toaster = useToaster()
  const [deleteModal, setDeleteModal] = useState(false)
  const [checked, setChecked] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
    confirmedPassword: '',
    image: '',
    is_admin: false
  })
  const [formEdit, setFormEdit] = useState({
    name: '',
    email: '',
    image: '',
    is_admin: false
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


  const handleAddUser = (e) => {
    setButtonLoading(true)
    e.preventDefault()
    const response = createUsers(formValue).then((response) => {

      message = <Message showIcon type='success' closable>Usuário adicionado com sucesso!</Message>
      toaster.push(message, {placement: 'topEnd', duration: 5000})
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
      toaster.push(message, {placement: 'topEnd', duration: 5000})
      setButtonLoading(false)
    })
  }


  //Função que atualiza as informações do usuário selecionado no banco de dados ao clicar no botão atualizar
  const handleUpdateUser = async (userId) => {
    setButtonLoading(true)
    await updateUser(userId, isAuthenticated, formEdit)

        .then((response) => {

          message = <Message showIcon type='success' closable>{response.data.message}</Message>
          toaster.push(message, {placement: 'topEnd', duration: 5000})
          setUpdateModal(false)
          setButtonLoading(false)
          fetchUsers()
        }).catch((error)=> {
          message = <Message showIcon type='error' closable>{error.response.data.message ? error.response.data.message : error.response.data.error.errors[0].message}</Message>
          toaster.push(message, {placement: 'topEnd', duration: 5000})
          setButtonLoading(false)
        })
  }


  //Função que faz a deleção do Usuário selecionado
  const handleDelete = async (id) => {

    await deleteUsers(id, isAuthenticated).then((response) => {

      setDeleteModal(false)

      message = <Message showIcon type='success' closable>{response.data.message}</Message>
      toaster.push(message, {placement: 'topEnd', duration: 5000})

      fetchUsers()

    }).catch((error) => {

      console.log(error)

      message = <Message showIcon type='error' closable>{error.response.data.message}</Message>
      toaster.push(message, {placement: 'topEnd', duration: 5000})
    })

  }

  //Função que faz o update da senha do usuário
  const handleUpdatePassword = async (userId) => {
    setButtonLoading(true)
    const response = await updatePassword(userId, isAuthenticated, formPass)

        .then((response) => {

          message = <Message showIcon type='success' closable>{response.data.message}</Message>
          toaster.push(message, {placement: 'topEnd', duration: 5000})

          setPasswordModal(false)
          setFormPass({
            prevPassword: '',
            passoword: ''
          })
          setButtonLoading(false)
        })

        .catch((error) => {

          message = <Message showIcon type='error' closable>{error.response.data.message}</Message>
          toaster.push(message, {placement: 'topEnd', duration: 5000})
          setButtonLoading(false)

        })

  }


  //Função que pega as informações do usuário a ser alterado ao clicar no botão de Editar Usuário
  const handleEditUser = async (userId) => {

    setSelectedUser(userId)
    const response = await getOneUser(userId, isAuthenticated)
        .then((response) => {
          setFormEdit({
            name: response.data.user.name,
            email: response.data.user.email,
            is_admin: response.data.user.is_admin
          })
          setTempImage(response.data.user.url)
          setUpdateModal(true)
        })


  }


  //Função de adicionar imagem ao form de usuário
  const handleImageAdd = async (e) => {
    const file = e.target.files[0]
    const base64Image = await convertToBase64(file)
    setFormValue(prevState => ({
      ...prevState,
      image: base64Image
    }))


  }


  const handleImageEdit = async (e) => {
    const file = e.target.files[0]
    const base64Image = await convertToBase64(file)
    setFormEdit(prevState => ({
      ...prevState,
      image: base64Image
    }))
    setTempImage(base64Image)
  }

  //Função utilizada para a transformação da imagem em base64
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


  //Componente personalizado para utilização de avatar na Tabela
  const ImageCell = ({rowData, dataKey, ...props}) => (
      <Cell {...props} style={{padding: 0}}>
        <div
            style={{
              width: 40,
              height: 40,
              background: '#f5f5f5',
              borderRadius: 6,
              marginTop: 2,
              overflow: 'hidden',
              display: 'inline-block'
            }}
        >
          <img src={rowData.url} width="40"/>
        </div>
      </Cell>
  );


  const handleModal= (userId = 0, setModal) => {
    setSelectedUser(userId)
  };


  const handleClose = () => {
    setUpdateModal(false)
    setDeleteModal(false)
    setPasswordModal(false)
    setAddModal(false)
    setFormValue(prevState => ({
      ...prevState,
      image: ''
    }))
    setSelectedUser(null)
  }

  const handleTest = () => {

    console.log(formEdit.is_admin)
  }


  return (

      <div>
        {/* Necessário para a abertura do toaster */}
        {message}
        <Header onClickProp={() => handleModal(setAddModal(true))}/>
        <FlexboxGrid align={"middle"} justify={"center"}>
          <FlexboxGrid.Item colspan={18}>
            <Table
                loading={loading}
                width={1100}
                height={600}
                data={data}
            >
              <Column width={40} align='center'>
                <HeaderCell>id</HeaderCell>
                <Cell dataKey="id"/>
              </Column>
              <Column width={90} align='center'>
                <HeaderCell>Avatar</HeaderCell>
                <ImageCell dataKey="url"/>
              </Column>

              <Column width={150} align='start'>
                <HeaderCell>Nome</HeaderCell>
                <Cell dataKey="name"/>
              </Column>

              <Column width={200} align='start'>
                <HeaderCell>Email</HeaderCell>
                <Cell dataKey="email"/>
              </Column>
             
              <Column width={120} align='start'>
                <HeaderCell>Telefone</HeaderCell>
                <Cell dataKey="telefone"/>
              </Column>

              <Column width={130} align='center'>
                <HeaderCell>Editar Informações</HeaderCell>

                <Cell style={{padding: '6px'}}>
                  {rowData => (
                      <IconButton icon={<Icon as={FaUserEdit}/>} appearance="primary"
                                  onClick={async () => handleEditUser(rowData.id)}>
                      </IconButton>

                  )}
                </Cell>

              </Column>


              <Column width={130} align='center'>

                <HeaderCell>Deletar Usuário</HeaderCell>
                <Cell style={{padding: '6px'}}>
                  {rowData => (

                      <IconButton appearance='primary' color='red' icon={<Icon as={MdDeleteForever}/>}
                                  onClick={async () => handleModal(rowData.id, setDeleteModal(true))}></IconButton>
                  )}
                </Cell>
              </Column>

              <Column width={130} align='center'>

                <HeaderCell>Editar Senha</HeaderCell>
                <Cell style={{padding: '6px'}}>
                  {rowData => (
                      <IconButton appearance='primary' color='green' icon={<Icon as={MdPassword}/>}
                                  onClick={async () => handleModal(rowData.id, setPasswordModal(true))}></IconButton>
                  )}
                </Cell>
              </Column>

            </Table>
          </FlexboxGrid.Item>
        </FlexboxGrid>

        {/* Modal de Deleção de Informações */}
        <Modal open={deleteModal} onClose={handleClose} size='xs'>
          <Modal.Header>
            <Modal.Title>Deletar Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza de que deseja deletar este usuário?
          </Modal.Body>
          <Modal.Footer>
            <Button appearence='primary' onClick={handleClose}>Cancelar</Button>
            <Button appearance='primary' color='red' onClick={async () => handleDelete(selectedUser)}>Deletar</Button>
          </Modal.Footer>
        </Modal>


        {/* Modal de Update de Informações */}
        <Modal open={updateModal} onClose={handleClose} size="xs">
          <Modal.Header>
            <Modal.Title>Atualizar Informação</Modal.Title>
          </Modal.Header>
          <Modal.Body align='center'>
            <img alt='avatar' src={tempImage} className={S.imageAvatar}/>
            <Form fluid onChange={setFormEdit} formValue={formEdit} align='start'>
              <Form.Group controlId="file-9">
                <Form.ControlLabel>Selecione sua foto</Form.ControlLabel>
                <input type='file' onChange={handleImageEdit}/>
                <Form.HelpText>Arquivos suportados: JPG, PNG, JFIF e RAW</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="name-9">
                <Form.ControlLabel>Nome</Form.ControlLabel>
                <Form.Control name="name"/>
                <Form.HelpText>Preencha este campo</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="email-9">
                <Form.ControlLabel>Email</Form.ControlLabel>
                <Form.Control name="email" type="email"/>
                <Form.HelpText>Preencha este campo</Form.HelpText>
              </Form.Group>
              <div className={S.toggleDiv}>
              Tornar administrador? 
              <Toggle checked={formEdit.is_admin} onChange={async () => setFormEdit(prevState => ({
                ...prevState,
                is_admin: !formEdit.is_admin
              }))}/>
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

        {/* Modal de troca de senha */}
        <Modal open={passwordModal} onClose={handleClose} size='xs'>
          <Modal.Header>
            <Modal.Title>Trocar Senha</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form fluid onChange={setFormPass} formValue={formPass}>
              <Form.Group controlId="prevPassword-9">
                <Form.ControlLabel>Senha Antiga</Form.ControlLabel>
                <Form.Control name="prevPassword"/>
                <Form.HelpText>Preencha este campo</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="password-9">
                <Form.ControlLabel>Nova Senha</Form.ControlLabel>
                <Form.Control name="password" type="password"/>
                <Form.HelpText>Preencha este campo</Form.HelpText>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} appearance="subtle">
              Cancelar
            </Button>
            <Button appearance="primary" color='green' loading={buttonLoading} onClick={async () => handleUpdatePassword(selectedUser)}>
              Atualizar
            </Button>
          </Modal.Footer>
        </Modal>


        {/*Modal para abrir página de Adição de Usuário*/}
        <Modal open={addModal} onClose={handleClose} size="xs">
          <Modal.Header>
            <Modal.Title>Adicionar Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body align={'center'}>
            <img src={formValue.image} alt={'Avatar'} className={S.imageAvatar}/>
            <Form fluid onChange={setFormValue} formValue={formValue} align={'start'}>
              <Form.Group controlId="file-9">
                <Form.ControlLabel>Selecione a foto do usuário</Form.ControlLabel>
                <input type='file' onChange={handleImageAdd}/>
                <Form.HelpText>Arquivos suportados: JPG, PNG, JFIF e RAW</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="name-9">
                <Form.ControlLabel>Nome</Form.ControlLabel>
                <Form.Control name="name"/>
                <Form.HelpText>Preencha este campo</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="email-9">
                <Form.ControlLabel>Email</Form.ControlLabel>
                <Form.Control name="email" type="email"/>
                <Form.HelpText>Preencha este campo</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="password-9">
                <Form.ControlLabel>Senha</Form.ControlLabel>
                <Form.Control name="password" type="password" autoComplete="off"/>
                <Form.HelpText>Deve conter entre 4 e 16 caracteres</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="confirmedPassword-9">
                <Form.ControlLabel>Confirmar Senha</Form.ControlLabel>
                <Form.Control name="confirmedPassword" type="password" autoComplete="off"/>
                <Form.HelpText>Deve ser igual a senha escrita acima</Form.HelpText>
              </Form.Group>
              <div className={S.toggleDiv}>
              Este usuário é um administrador? 
              <Toggle checked={formValue.is_admin} onChange={async () => setFormValue(prevState => ({
                ...prevState,
                is_admin: !formValue.is_admin
              }))}/>
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

        
      </div>
  )
}
export default Home