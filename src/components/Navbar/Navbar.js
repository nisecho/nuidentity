import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {auth, firestore, storage} from '../../firebase';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import MakePost from '../MakePost/MakePost';
import {doc, getDoc} from "firebase/firestore";
export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profileURL, setProfileURL] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMakePost, setOpenMakePost] = useState(false);

    const [showMakePost, setShowMakePost] = useState(false);
    const toggleMakePost = () => {
        setShowMakePost(!showMakePost);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(firestore, 'users', currentUser.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUser(currentUser);
                    setProfileURL(userDocSnapshot.data().profilePicture);
                } else {
                    console.log('No such document!');
                }
            } else {
                setUser(null);
                setProfileURL('');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        auth.signOut();
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNuidentityClick = () => {
        navigate('/');
    };

    const handlePost = () => {
        setAnchorEl(null);
        setOpenMakePost(true);
    };
    const handleCloseMakePost = () => {
        setOpenMakePost(false);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftContent}>
                <img src="/path/to/left-image.png" alt="~" />
            </div>
            <div onClick={handleNuidentityClick}>
                <img src="/path/to/center-image.png" alt="Nuidentity" />
            </div>
            <div className={styles.rightContent}>
                {user ? (
                    <div>
                        <Avatar
                            alt="Profile"
                            src={profileURL}
                            className={styles.profilePicture}
                            onClick={handleMenuOpen}
                        />
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={toggleMakePost}>
                                Post
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                                <Link to="/profile">Profile</Link>
                            </MenuItem>
                            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
            {showMakePost && <MakePost isOpen={showMakePost} handleClose={toggleMakePost} />}
        </nav>
    );
};
