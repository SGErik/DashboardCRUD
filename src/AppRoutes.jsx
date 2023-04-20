import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import { Loader } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import { useSelector } from 'react-redux';




const AppRoutes = () => {

    const Private = ({ children }) => {

        const { isAuthenticated } = useSelector(state => state.authReducer)


        if (!isAuthenticated) {
            return <Navigate to="/login" />
        }

        return children

    }

    const AuthLogin = ({ children }) => {
        const token = localStorage.getItem('token')


        if(token){
            return <Navigate to='/home' />
        }

        return children
    }

    

    return (
        <Router>
            
                <Routes >

                    <Route exact path='/login' element={<Login />}/>
                    <Route exact path='/home' element={<Private><Home /></Private>} />

                </Routes>

            
        </Router>
    )
}

export default AppRoutes