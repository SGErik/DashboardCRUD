import React from 'react'
import Header from '../../components/Header/Header'
import AddressModal from '../../components/AddressModal/AddressModal.jsx'
import { getUsers, getOneUser, getUserAddress } from '../../services/api'
import { Table, IconButton,  FlexboxGrid } from 'rsuite'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import "rsuite/dist/rsuite.min.css";
import { Icon } from '@rsuite/icons';
import { MdDeleteForever, MdPassword } from "react-icons/md";
import { FaUserEdit, FaHouseUser } from "react-icons/fa"
import DeleteModal from "../../components/DeleteModal/DeleteModal.jsx";
import AddModal from "../../components/AddModal/AddModal.jsx";
import PasswordModal from "../../components/PasswordModal/PasswordModal.jsx";
import EditUserModal from "../../components/EditUserModal/EditUserModal.jsx";









const Home = () => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { Column, HeaderCell, Cell } = Table;
  const { isAuthenticated } = useSelector(state => state.authReducer)
  const [tempImage, setTempImage] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)
  const [addressModal, setAddressModal] = useState(false)
  const [emptyAddress, setEmptyAddress] = useState(false)
  const [addressInfo, setAddressInfo] = useState({
    zipcode: '',
    neighborhood: '',
    city: '',
    state: '',
    street: '',
    addressNumber: '',
    complement: ''
  })

  const [addressId, setAddressId] = useState('')
  const [formEdit, setFormEdit] = useState({
    name: '',
    email: '',
    image: '',
    telefone: '',
    is_admin: false
  })

  const fetchUsers = async () => {
    const response = await getUsers(isAuthenticated)
        .then((response) => {
          setData(response.data.users.sort((a, b) => a.name.localeCompare(b.name)))
          setLoading(false)
        })
        .catch((error) => {
          console.log(error)
        })
  };

  useEffect( () => {
   fetchUsers()
  }, [])



  const handleEditUser = async (userId) => {

    setSelectedUser(userId)
    const response = await getOneUser(userId, isAuthenticated)
        .then((response) => {
          setFormEdit({
            name: response.data.user.name,
            email: response.data.user.email,
            telefone: response.data.user.telefone,
            is_admin: response.data.user.is_admin
          })
          setTempImage(response.data.user.url)
          setUpdateModal(true)
        })
  }


  async function handleAddressInfo(userId, setModal) {
   
    setSelectedUser(userId)

    const response = await getUserAddress(userId)
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
        console.log(response)

      })
      .catch((error) => {
        console.log(error)
      })

  }

  //Componente personalizado para utilização de avatar na Tabela
  const ImageCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
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
        <img src={rowData.url} alt={'Foto Avatar'} width="40" />
      </div>
    </Cell>
  );


  const handleModal = (userId = 0, setModal) => {
    setSelectedUser(userId)
  };


  return (

    <div>
      <Header onClickProp={() => handleModal(setAddModal(true))} />
      <FlexboxGrid align={"middle"} justify={"center"}>
        <FlexboxGrid.Item colspan={20}>
          <Table
            loading={loading}
            width={1200}
            height={500}
            data={data}
          >
            <Column width={40} align='center'>
              <HeaderCell>id</HeaderCell>
              <Cell dataKey="id" />
            </Column>
            <Column width={90} align='center'>
              <HeaderCell>Avatar</HeaderCell>
              <ImageCell dataKey="url" />
            </Column>

            <Column width={150} align='start'>
              <HeaderCell>Nome</HeaderCell>
              <Cell dataKey="name" />
            </Column>

            <Column width={200} align='start'>
              <HeaderCell>Email</HeaderCell>
              <Cell dataKey="email" />
            </Column>

            <Column width={130} align='start'>
              <HeaderCell>Telefone</HeaderCell>
              <Cell dataKey="telefone" />
            </Column>

            <Column width={130} align='center'>
              <HeaderCell>Editar Informações</HeaderCell>

              <Cell style={{ padding: '6px' }}>
                {rowData => (
                  <IconButton icon={<Icon as={FaUserEdit} />} appearance="primary"
                    onClick={async () => handleEditUser(rowData.id)}>
                  </IconButton>

                )}
              </Cell>

            </Column>
            <Column width={130} align='center'>
              <HeaderCell>Deletar Usuário</HeaderCell>
              <Cell style={{ padding: '6px' }}>
                {rowData => (
                    <IconButton appearance='primary' color='red' icon={<Icon as={MdDeleteForever} />}
                    onClick={async () => handleModal(rowData.id, setDeleteModal(true))}></IconButton>
                )}
              </Cell>
            </Column>

            <Column width={130} align='center'>
              <HeaderCell>Editar Senha</HeaderCell>
              <Cell style={{ padding: '6px' }}>
                {rowData => (
                  <IconButton appearance='primary' color='green' icon={<Icon as={MdPassword} />}
                    onClick={async () => handleModal(rowData.id, setPasswordModal(true))}></IconButton>
                )}
              </Cell>
            </Column>

            <Column width={130} align='center'>
              <HeaderCell>Atualizar Endereço</HeaderCell>
              <Cell style={{ padding: '6px' }}>
                {rowData => (
                  <IconButton appearance='primary' color='orange' icon={<Icon as={FaHouseUser} />}
                    onClick={async () => handleAddressInfo(rowData.id, setAddressModal(true))}></IconButton>
                )}
              </Cell>
            </Column>
          </Table>
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <EditUserModal selectedUser={selectedUser}
                     fetchUsers={async () => fetchUsers()}
                     setFormEdit={setFormEdit}
                     formEdit={formEdit}
                     setTempImage={setTempImage}
                     updateModal={updateModal}
                     setUpdateModal={setUpdateModal}
                     tempImage={tempImage} />

      <PasswordModal selectedUser={selectedUser}
                     passwordModal={passwordModal}
                     setPasswordModal={setPasswordModal} />

      <AddModal addModal={addModal}
                setAddModal={setAddModal}
                fetchUsers={async () => fetchUsers()} />

      <DeleteModal deleteModal={deleteModal}
                   setDeleteModal={setDeleteModal}
                   selectedUser={selectedUser}
                   fetchUsers={async () => fetchUsers()} />

      <AddressModal addressModal={addressModal}
                    selectedUser={selectedUser}
                    emptyAddress={emptyAddress}
                    setAddressModal={setAddressModal}
                    addressId={addressId}
                    setAddressId={setAddressId}
                    addressInfo={addressInfo}
                    setAddressInfo={setAddressInfo} />
    </div>
  )
}
export default Home