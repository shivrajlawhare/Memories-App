import React from "react";
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'


import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import makeStyles from  './styles';
import { useDispatch } from 'react-redux';

import { deletePost, likePosts} from '../../../actions/posts'

const Post = ({post, setCurrentId}) => {
    const classes = makeStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    const Likes = () => {
        if (post.likes.length > 0) {
            return post.likes.find((like) => like === (user?.result?._id))
            ? (
                <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likes.length > 2 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}` }</>
            ) : (
                <><ThumbUpAltOutlinedIcon fontSize="small" />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }

        return <><ThumbUpAltOutlinedIcon fontSize="small" />&nbsp;Like</>;
    };

    return(
        <Card className={classes.card}>
            <CardMedia className={classes.media} image={post.selectedFile} title = {post.title} />
            <div className={classes.overlay} ></div>
            <Typography variant="h6"  >{post.nameS}</Typography>
            <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
            {(user?.result?.googleId === post.creator || user?.result?._id === post.creator) && 
            <div className={classes.overlay2}>
                <Button 
                    style={{color: 'white'}} 
                    size="small" 
                    onClick={() => {setCurrentId(post._id)}}>Update</Button>
                <MoreHorizIcon fontSize="medium" />
            </div>
            }
            
            <div className={classes.details} >
                <Typography variant="body2" color="textSecondary"  >{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
            <Typography className={classes.title} variant="h5" gutterBottom >{post.title}</Typography>
            <CardContent>
                <Typography variant="body2" color = "textSecondary" component="p"  >{post.message}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" disabled={!user?.result} onClick={() => dispatch(likePosts(post._id))} >
                    <Likes />
                </Button>
                {(user?.result?._id === post.creator) && 
                <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))} >
                    <DeleteIcon fontSize="small"/>
                    Delete
                </Button>
                }
                
            </CardActions>
        </Card>
    );
}

export default Post ;