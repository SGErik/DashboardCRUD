import React, { useState } from 'react'
import "rsuite/dist/rsuite.min.css";
import {
    Container,
    Content,
    Form,
    ButtonToolbar,
    Button,
    Panel,
    FlexboxGrid,
    Schema, useToaster,
    Message, Modal
} from 'rsuite';
import S from './LoginForm.module.css'
import { authUsers, createUsers } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../store/user/user.actions';
import { useNavigate , redirect } from 'react-router-dom';



const LoginForm = () => {
    let message
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)
    const [formValue, setFormValue] = useState({
        name: '',
        email: '',
        password: '',
        confirmedPassword: '',
        image: ''
    })
    const [adminBol, setAdminBol] = useState(null)
    const toaster = useToaster()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const  { isAuthenticated }  = useSelector( state => state.authReducer)
    const  isAdmin  = useSelector(state => state.authReducer.isAdmin)



    //Função que faz o Registro na Aplicação ao clicar no Botão de Registrar
    function handleRegister(e) {
        setLoading(true)
        e.preventDefault()
        const response = createUsers(formValue).then((response) => {

            message = <Message showIcon type='success' closable>{response.data.message}</Message>
            toaster.push(message, { placement: 'topEnd', duration: 5000 })
            setOpen(false)
            setFormValue({
                name: '',
                email: '',
                password: '',
                confirmedPassword: '',
                image: ''
            })
            setLoading(false)

        }).catch((error) => {

            message = <Message showIcon type='error' closable >{error.response.data.message ? error.response.data.message : error.response.data.error.errors[0].message}</Message>
            toaster.push(message, { placement: 'topEnd', duration: 5000 })
            setLoading(false)
        })

    }


    //Função que faz o login na aplicação ao Clicar no botão de Login
     async function handleSubmit(e) {
         setLoginLoading(true)
        e.preventDefault()
        const response = await authUsers(email, password).then((response)=> {
            const token = response.data.token
            const userInfo = response.data.user
            const isAdministrator = response.data.user.is_admin


            localStorage.setItem('user', JSON.stringify(userInfo));
            localStorage.setItem('token', token);
            localStorage.setItem('isadmin', isAdministrator)

            dispatch(loginSuccess(token, isAdministrator))
            setLoginLoading(false)
            if(isAdministrator){
                return navigate('/home')
            }else {
                return navigate('/dashboard')
            }
        }).catch((error) => {

            console.log(error)
            message = <Message showIcon type='error' closable>{error.response.data.message}</Message>

            toaster.push(message, { placement: 'topEnd', duration: 5000 })
            setLoginLoading(false)
        })


    }


    const handleImageSubmit = async (e) => {

        const file = e.target.files[0]
        const base64Image = await convertToBase64(file)
        setFormValue(prevState => ({
            ...prevState,
            image: base64Image
        }))
    }

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







    const handleOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    }


    const { StringType } = Schema.Types;
    const model = Schema.Model({
        email: StringType().isRequired('Este campo não pode ser vazio'),
        password: StringType().isRequired('Este campo não pode ser vazio')
    })


    return (
        <div className={S.principalDiv}>
            {message}
            <Container>
                <Content>
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item colspan={12}>
                            <Panel header={<h3>Login</h3>} bordered>

                                <Form fluid model={model}>
                                    <Form.Group>
                                        <Form.ControlLabel>Email</Form.ControlLabel>
                                        <Form.Control name="email" value={email} onChange={setEmail} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.ControlLabel>Password</Form.ControlLabel>
                                        <Form.Control name="password" type="password" autoComplete="off" value={password} onChange={setPassword} />
                                    </Form.Group>
                                    <Form.Group>
                                        <ButtonToolbar>
                                            <Button appearance="primary" loading={loginLoading} onClick={handleSubmit}>Login</Button>
                                            <Button appearance='link' onClick={handleOpen}>Registre-se</Button>
                                        </ButtonToolbar>
                                    </Form.Group>
                                </Form>
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Content>
            </Container>
            <Modal open={open} onClose={handleClose} size="xs">
                <Modal.Header>
                    <Modal.Title>Registrar-se</Modal.Title>
                </Modal.Header>
                <Modal.Body align={'center'}>
                    <img src={formValue.image} alt={'Avatar'} className={S.formImage}/>
                    <Form fluid onChange={setFormValue} formValue={formValue} align={'start'}>
                    <Form.Group controlId="file-9">
                        <Form.ControlLabel>Selecione sua foto</Form.ControlLabel>
                            <input type='file' onChange={handleImageSubmit}/>
                            <Form.HelpText>Arquivos suportados: JPG, PNG, JFIF e RAW</Form.HelpText>
                        </Form.Group>
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
                        <Form.Group controlId="password-9">
                            <Form.ControlLabel>Senha</Form.ControlLabel>
                            <Form.Control name="password" type="password" autoComplete="off" />
                            <Form.HelpText>Deve conter entre 4 e 16 caracteres</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="confirmedPassword-9">
                            <Form.ControlLabel>Confirmar Senha</Form.ControlLabel>
                            <Form.Control name="confirmedPassword" type="password" autoComplete="off" />
                            <Form.HelpText>Deve ser igual a senha escrita acima</Form.HelpText>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleRegister} loading={loading} appearance="primary">
                        Registrar
                    </Button>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LoginForm