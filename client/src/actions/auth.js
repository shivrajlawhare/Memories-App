import { AUTH } from '../constants/actionTypes';
import * as api from '../api';

export const signin = (formData, history) => async(dispatch) => {
    try {
        // login user
        const { data } = await api.signIn(formData);
        dispatch({type: AUTH, data});
        history('/');
    } catch (error) {
        console.log(error);
    }
}

export const signinGoogle = (accessToken, history) => async (dispatch)=>{
    try{
        // login user
        const {data} = await api.signInGoogle(accessToken)

        dispatch({type : AUTH, data})
        history("/")
    }catch(err){
        console.log(err)
    }
}

export const signup = (formData, history) => async(dispatch) => {
    try {
        // login user
        const { data } = await api.signUp(formData);
        dispatch({type: AUTH, data});
        history('/');
    } catch (error) {
        console.log(error);
    }
}

export const signupGoogle = (accessToken, history) => async (dispatch)=>{
    try{
        // signup user

        const {data} = await api.signUpGoogle(accessToken)

        dispatch({type : AUTH, data})
        history("/")
    }catch(err){
        console.log(err)
    }
}