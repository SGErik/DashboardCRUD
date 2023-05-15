import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard';
import "rsuite/dist/rsuite.min.css";
import { useSelector } from 'react-redux';




const AppRoutes = () => {

    const PrivateHome = ({ children }) => {

        const { isAuthenticated } = useSelector(state => state.authReducer)
        const { isAdmin } = useSelector(state => state.authReducer)

        
        

        return !isAuthenticated ? <Navigate to={'/login'} /> : (isAuthenticated && !isAdmin ? <Navigate to='/dashboard'/> : children)
            
        }

        const PrivateLogin = ({ children }) => {
            
            const { isAuthenticated } = useSelector(state => state.authReducer)
            const { isAdmin } = useSelector(state => state.authReducer)



            return isAuthenticated && isAdmin  ? <Navigate to={'/home'} /> : (isAuthenticated && !isAdmin ? <Navigate to={'/dashboard'} /> : children)
        }

        const PrivateDash = ({ children }) => {
            const { isAuthenticated } = useSelector(state => state.authReducer)
            const { isAdmin } = useSelector(state => state.authReducer)




            return isAuthenticated && isAdmin ? <Navigate to={'/home'} /> : (!isAuthenticated ? <Navigate to={'/login'} /> : children)
}
    





    return (
        <Router>

            <Routes >
                <Route path='/' element={<PrivateLogin><Login/></PrivateLogin>} />
                <Route exact path='/login' element={<PrivateLogin><Login /></PrivateLogin>} />
                <Route path='/home' element={<PrivateHome><Home /></PrivateHome>} />
                <Route path='/dashboard' element={<PrivateDash><Dashboard/></PrivateDash>} />
            </Routes>


        </Router>
    )
}

export default AppRoutes