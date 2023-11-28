import React, { useState, useEffect } from 'react';
import { Avatar, TextField, Button } from '@mui/material';
import styles from './Post.module.css';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import {auth, firestore} from '../../firebase';
import { useNavigate } from 'react-router-dom';


const Post = ({id, image_url, pfp, user, caption}) => {
    const navigate = useNavigate();
    const [thisUID, setThisUID] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [userData, setUserData] = useState({ displayName: '', pfp: '' });
    const [likesCount, setLikesCount] = useState(0);
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setThisUID(currentUser.uid);
            } else {
                navigate("/")
            }
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const userDocRef = doc(firestore, 'users', user.uuid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserData({
                        displayName: userData.displayName,
                        pfp: userData.profilePicture,
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchLikesData = async () => {
            const postRef = doc(firestore, 'posts', id);
            const postSnapshot = await getDoc(postRef);
            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                setLikesCount(postData.likes.length);
                setLikedByCurrentUser(postData.likes.includes(thisUID));
            }
        };

        fetchPostData();
        fetchLikesData();
    }, [id, user.uuid]);

    useEffect(() => {
        const commentsCollection = collection(firestore, 'posts', id, 'comments');
        const q = query(commentsCollection, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const fetchedComments = [];
            for (const doc1 of snapshot.docs) {
                let commentData = doc1.data();
                let uid = commentData.user_id;

                const userDocRef = doc(firestore, 'users', uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    commentData.user = userData;
                    fetchedComments.push(commentData);
                } else {
                    console.log('No such document for user ID:', uid);
                }
            }

            setComments(fetchedComments);
        });

        return () => unsubscribe();
    }, [id]);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmitComment = async () => {
        if (comment.trim() !== '') {
            const commentsCollection = collection(firestore, 'posts', id, 'comments');
            try {
                await addDoc(commentsCollection, {
                    content: comment,
                    user_id: thisUID,
                    timestamp: serverTimestamp(),
                });
                setComment('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleLikeClick = async () => {
        try {
            const postRef = doc(firestore, 'posts', id);

            if (likedByCurrentUser) {
                await updateDoc(postRef, {
                    likes: arrayRemove(thisUID),
                });
                setLikesCount((prevCount) => prevCount - 1);
                setLikedByCurrentUser(false);
            } else {
                await updateDoc(postRef, {
                    likes: arrayUnion(thisUID),
                });
                setLikesCount((prevCount) => prevCount + 1);
                setLikedByCurrentUser(true);
            }
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    return (
        <div className={styles.post}>
            <div className={styles.leftContent}>
                <img src={image_url} alt="Post"/>
            </div>
            <div className={styles.rightContent}>
                <div className={styles.userInfo}>
                    <Avatar src={userData.pfp} alt="Profile"/>
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${user.uuid}`)}
                    >
                        {userData.displayName}
                    </span>
                </div>
                <p className={styles.caption}>{caption}</p>
                <div className={styles.commentSection}>
                    <div className={styles.comments}>
                        {comments.map((comment, index) => (
                            <p key={index}>
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${comment.user_id}`)}
                    >
                        {comment.user.displayName}
                    </span>
                                : {comment.content}
                            </p>
                        ))}
                    </div>
                    <div className={styles.commentInput}>
                        <TextField
                            label="Add a comment"
                            variant="outlined"
                            size="small"
                            value={comment}
                            onChange={handleCommentChange}
                        />
                        <Button variant="contained" onClick={handleSubmitComment}>
                            Post
                        </Button>
                    </div>
                    <div className={styles.likeButton}>
                        <Button
                            variant="contained"
                            color={likedByCurrentUser ? 'secondary' : 'primary'}
                            onClick={handleLikeClick}
                        >
                            {likedByCurrentUser ? 'Unlike' : 'Like'}
                        </Button>
                        <span>{likesCount} Likes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
