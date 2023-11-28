import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileInfo = () => {
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

    return (
        <div>
            {userData && (
                <div>
                    <img
                        src={newProfilePicture || userData.profilePicture}
                        alt="Profile"
                        style={{ cursor: 'pointer' }}
                    />

                    <h2>{userData.displayName}</h2>
                    {userData.bio}
                    <p>Number of Posts: {userData.numberOfPosts}</p>
                    <p>Date Signed Up: {userData.dateSignedUp}</p>
                </div>
            )}
        </div>
    );
};

export default ProfileInfo;
