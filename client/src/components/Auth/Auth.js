import React, { useState } from 'react'
import { Avatar, Paper, Button, Grid, Typography, Container } from '@material-ui/core';
// import Icon from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import { GoogleLogin } from 'react-google-login';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import makeStyles from  './styles';
import Input from './Input';
import Icon from './icon';
import { signup, signin } from '../../actions/auth';

const initialState = { firstName:'',lastName:'',email:'',password:'',confirmPassword:'' };


const Auth = () => {
    const [showPassword, setShowPassword]  = useState(false);
    const classes = makeStyles();
    const [isSignup, setIsSignup] = useState(false);
    const [formData,setFormData] = useState(initialState);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup){
            dispatch(signup(formData,history))
        } else{
            dispatch(signin(formData,history))
        }
    };
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    const history = useNavigate();

    const switchMode = () => {
        setFormData(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    }

    // const googleSuccess = async (res) => {
    //     console.log(res)
    // }

    // const googleFailure = () => {
    //     console.log('google sign in error')
    // }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    // const login = useGoogleLogin({
    //     onSuccess: (tokenResponse) => console.log(tokenResponse),
    // })

    const googleLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
        //   console.log(tokenResponse);
          const token = tokenResponse.access_token
          // fetching userinfo can be done on the client or the server
          const userInfo = await axios
            .get('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
            .then(res => res?.data);
        
          console.log(userInfo);
          const result = userInfo;
          try {
            dispatch({type: 'AUTH', data: {token, result}})
            history('/');
            // dispatch(signup(formData,history))

          } catch (error) {
            console.log(error);
          }
        }
    });


  return (
        <Container component="main" maxWidth="xs" >
            <Paper className={classes.paper} elevation={3} >
                <Avatar className={classes.avatar} >
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5" >{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input  name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    {/* <GoogleLogin
                        onSuccess={credentialResponse => {
                            console.log(credentialResponse);
                            const result = credentialResponse ? jwtDecode(credentialResponse.credential) : null
                            // const result = credentialResponse?.profileObj;
                            const token = null;
                            try {
                                dispatch({type: 'AUTH', data: {token, result}})
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />; */}
                    <Button 
                        className={classes.googleButton} 
                        color="primary" 
                        fullWidth 
                        onClick={() => googleLogin()} 
                        startIcon={<Icon />} 
                        variant="contained" 
                    >
                        Google Sign In
                    </Button>
                    {/* <GoogleLogin 
                        clientId="81856096176-56jl3mvhfr7r2f687naj7qk07o3ig1o7.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button 
                                className={classes.googleButton} 
                                color="primary" 
                                fullWidth 
                                onClick={renderProps.onClick} 
                                disabled={renderProps.disabled} 
                                startIcon={<Icon />} 
                                variant="contained" 
                            >
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                    /> */}
                    <Grid container justifyContent="flex-end" >
                        <Grid item >
                            <Button onClick={switchMode} >
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth