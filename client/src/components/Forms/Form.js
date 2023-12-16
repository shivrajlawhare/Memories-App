import React, { useState, useEffect } from "react";
import { TextField,Button, Typography, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
// import { FileBase } from 'react-file-base64';

import makeStyles from  './styles';
import { createPosts, updatePosts } from "../../actions/posts";


const Form = ({currentId, setCurrentId}) => {
    const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedFile: ''
    })
    const classes = makeStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'))

    useEffect(() => {
        if(post) setPostData(post)
    },[post])

    const onChange = e => {
        const files = e.target.files;
        const file = files[0];
        getBase64(file);
    };
    
    // const onLoad = fileString => {
    //     console.log(fileString);
    // };
    
    const getBase64 = file => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
        //   onLoad(reader.result);
          setPostData({...postData,selectedFile: reader.result})
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(currentId){
            dispatch(updatePosts(currentId,{...postData,name: user?.result?.name}));

        }else{
            dispatch(createPosts({...postData,name: user?.result?.name}));
        }
        clear();
    }

    const clear = () => {
        setCurrentId(null);
        setPostData({title: '',message: '',tags: '',selectedFile: ''});
    }

    if(!user?.result?.name){
        return(
            <Paper classes={classes.paper}>
                <Typography variant="h6" align="center">
                Please Sign In to create your own memory
                </Typography>
            </Paper>
        )
    }

    return(
       <Paper className={classes.paper}>
        <form autoCapitalize="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
            <Typography variant="h6"> {currentId ? 'Editing' : 'Creating'} a Memory </Typography>
            <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title}onChange={(event) => setPostData({ ...postData,title: event.target.value})}/>
            <TextField name="message" variant="outlined" label="Message" fullWidth value={postData.message}onChange={(event) => setPostData({ ...postData,message: event.target.value})}/>
            <TextField name="tags" variant="outlined" label="Tags" fullWidth value={postData.tags}onChange={(event) => setPostData({ ...postData,tags: event.target.value.split(',')})}/>
            {/* <div className={classes.fileInput}> <FileBase type="file" multiple={false} onDone={({base64}) => setPostData({...postData,selectedFile: base64 }) } /></div> */}
            <div className={classes.fileInput}><input type="file" onChange={onChange} /></div>
            <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
            <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
        </form>
       </Paper>
    );
}

export default Form 