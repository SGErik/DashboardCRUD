import React from 'react'
import Header from '../../components/Header/Header'
import { api, getUsers, deleteUsers } from '../../services/api'
import { Table, Button } from 'rsuite'
import { useState } from 'react'
import "rsuite/dist/rsuite.min.css";
import S from './Home.module.css'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'








const Home = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { Column, HeaderCell, Cell } = Table;
  const { isAuthenticated } = useSelector(state => state.authReducer)


  //useEffect para realizar requisição assim que a página é Renderizada
  useEffect(() => {

    const fetchUsers = async () => {
      const response = await getUsers(isAuthenticated);


      setData(response.data.users.sort((a, b) => a.name.localeCompare(b.name)))
      console.log(data)
      setLoading(false)
    };
    fetchUsers()

  }, [])


  const handleDelete = async (id)=> {
  
  await deleteUsers(id, isAuthenticated).then(()=> {
    window.location.reload()
  }).catch((error)=> {
    console.log(error)
  })
  

  }







  return (

    <div>
      <Header />
      <Table
        loading={loading}
        height={400}
        data={data}
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={150}>
          <HeaderCell>Nome</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={300}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={80} fixed="right">
          <HeaderCell>Editar</HeaderCell>

          <Cell style={{ padding: '6px' }}>

            <Button appearance="link">
              Editar
            </Button>
          </Cell>

        </Column>
        <Column width={80} fixed="right">

          <HeaderCell>Deletar</HeaderCell>
          <Cell style={{ padding: '6px' }}>
             {rowData => (
               <Button appearance='link' onClick={async () => handleDelete(rowData.id)}>Deletar</Button>
               
             )}
          
          </Cell>


        </Column>
      </Table>
      <Button>Teste</Button>

    </div>
  )
}

export default Home