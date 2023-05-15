import React from 'react'
import {useSelector} from "react-redux";
import Header from "../../components/Header/Header.jsx";



const Dashboard = () => {
  const { isAdmin } = useSelector(state => state.authReducer)

  return (
    <div>
      <Header/>
      <button>teste</button>
    </div>

  )
}

export default Dashboard
