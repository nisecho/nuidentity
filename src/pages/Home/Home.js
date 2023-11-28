import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PostView from '../../components/PostView/PostView';
import { Container } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import {auth, firestore} from '../../firebase';
import {useNavigate} from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    const [showMakePost, setShowMakePost] = useState(false);
    const [posts, setPosts] = useState([]);

    const toggleMakePost = () => {
        setShowMakePost(!showMakePost);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
            } else {
                navigate("/login")
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(firestore, 'posts');
                const querySnapshot = await getDocs(postsCollection);
                const fetchedPosts = [];
                querySnapshot.forEach((doc) => {
                    fetchedPosts.push({ id: doc.id, ...doc.data() });
                });
                setPosts(fetchedPosts);

            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <>
            <Navbar toggleMakePost={toggleMakePost}/>
            <Container maxWidth="md">
                <PostView posts={posts} />
            </Container>
        </>
    );
};

export default Home;
