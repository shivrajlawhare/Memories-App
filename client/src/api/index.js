import axios from "axios";



const API = axios.create({ baseURL: 'http://localhost:5000'})


API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }

    return req;
})

export const fetchPosts = () => API.get('/posts'); 
export const createPosts = (newPost) => API.post('/posts', newPost);
export const updatePosts = (id,updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePosts = (id) => API.delete(`/posts/${id}`);
export const likePosts = (id) => API.patch(`/posts/${id}/likePost`);

export const signIn = (formData) => API.post('/user/signin', formData)
export const signInGoogle = (accessToken) => API.post("/user/signin", {
    googleAccessToken: accessToken
})

export const signUp = (formData) => API.post('/user/signup', formData)
export const signUpGoogle = (accessToken) => API.post("/user/signup", {
    googleAccessToken: accessToken
})


