import 'rsuite/dist/rsuite.min.css';
import './App.css'
import AppRoutes from './AppRoutes';
import { Provider } from 'react-redux';
import store from './store/index'


function App() {


  return (
    <div className="App">
      <Provider store={store}>
      <AppRoutes />
      </Provider>
    </div>
  )
}

export default App
