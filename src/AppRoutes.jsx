import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard';
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

        const PrivateLogin = ({ children }) => {
            
            const { isAuthenticated } = useSelector(state => state.authReducer)

            
            
            return isAuthenticated ? <Navigate to='/home' /> : children
            
            
        }
    
    
    




    return (
        <Router>

            <Routes >
                <Route path='/' element={<PrivateLogin><Login/></PrivateLogin>} />
                <Route exact path='/login' element={<PrivateLogin><Login /></PrivateLogin>} />
                <Route path='/home' element={<Private><Home /></Private>} />
                <Route path='/dashboard' element={<Private><Dashboard/></Private>} />

            </Routes>


        </Router>
    )
}

export default AppRoutes