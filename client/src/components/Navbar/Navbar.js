import {React, useState, useEffect} from 'react'
import { AppBar, Avatar, Button, Toolbar, Typography} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import makeStyles from './styles'
import memories from '../../images/memories.png';
import {Link} from 'react-router-dom'



const Navbar = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const location = useLocation();
    const classes = makeStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    // setUser(null)
    console.log(user);

    useEffect(() => {
        const token = user?.token
        if(token){
            const token = user?.token;
            if(token){
                const decodedToken = jwtDecode(token);

                if(decodedToken.exp * 1000 < new Date().getTime()) logout();
            }
        }

        setUser(JSON.parse(localStorage.getItem('profile')))
    },[location]);

    const logout = () => {
        dispatch({type: 'LOGOUT'})
        history('/');
        setUser(null);
    }

    return (
    <div>
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <Typography component = {Link} to="/" className={classes.heading} variant='h2' align='center'>
                    Memories
                </Typography>
                <img className={classes.image} src={memories} alt="memories" height="60" />
            </div>
            <Toolbar className={classes.toolbar}>
                { user?.result ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout} >Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    </div>
  )
}

export default Navbar