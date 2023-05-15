import React from 'react'
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header.jsx";



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
      <button onClick={handleTest}>teste</button>
    </div>

  )
}

export default Dashboard
