import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore, storage } from '../../firebase'; // Import your firebase configurations
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button, Avatar } from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [newProfilePicture, setNewProfilePicture] = useState('');
    const [newBio, setNewBio] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                await fetchUserData(currentUser.uid);
            } else {
                setUser(null);
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserData = async (uid) => {
        try {
            const userDocRef = doc(firestore, 'users', uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                setUserData(userDocSnapshot.data());
                setNewProfilePicture(userDocSnapshot.data().profilePicture);
                setNewBio(userDocSnapshot.data().bio);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const updateProfilePicture = async (file) => {
        try {
            const storageRef = ref(storage, `profilePictures/${user.uid}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                },
                (error) => {
                    console.error('Error uploading profile picture:', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        try {
                            const userDocRef = doc(firestore, 'users', user.uid);
                            await updateDoc(userDocRef, { profilePicture: downloadURL });
                            console.log('Profile picture updated!');
                        } catch (error) {
                            console.error('Error updating profile picture URL in Firestore:', error);
                        }
                    });
                }
            );
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            setNewProfilePicture(URL.createObjectURL(file));
            updateProfilePicture(file);
        }
    };

    const handleBioChange = async () => {
        try {
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, { bio: newBio });
            console.log('Bio updated!');
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    return (
        <div>
            {userData && (
                <div>
                    <Avatar
                        src={newProfilePicture || userData.profilePicture}
                        alt="Profile"
                        onClick={handleAvatarClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />

                    <h2>{userData.displayName}</h2>
                    <textarea
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        rows={4}
                        cols={50}
                        placeholder="Enter your new bio"
                    />
                    <Button variant="contained" onClick={handleBioChange}>
                        Update Bio
                    </Button>
                    <p>Number of Posts: {userData.numberOfPosts}</p>
                    <p>Date Signed Up: {userData.dateSignedUp}</p>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
