import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import s from "./Signup.module.css";
import p from '../pages.module.css';
import {collection, doc, setDoc} from "firebase/firestore";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user profile data in Firestore
            //const userDoc = await collection(firestore, 'users').doc(uid).get();
            const userDoc = doc(firestore, 'users', user.uid);
            await setDoc(userDoc, {
                displayName: displayName || '',
                email: user.email || '',
                profilePicture: user.photoURL || '',
                bio: '', // Add default values for other fields
                numberOfPosts: 0,
                dateSignedUp: new Date().toISOString(),
            });

            console.log('User signed up:', userCredential.user);
            // Navigate to a success page or home page
        } catch (error) {
            console.error('Error signing up:', error);
            // Handle error, display error message, etc.
        }
        setIsLoading(false);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleDisplayNameChange = (event) => {
        setDisplayName(event.target.value); // Update display name state
    };

    return (
        <div className={`${p.page}`}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');`}
            </style>
            <div id="recaptcha-container"></div>
            <div className={`${s.container}`}>
                <div className={`${s.containerImage}`}>
                    <img className={`${s.logo}`} src="/logo.png" alt={'Nuidentity'} height="60px"/>
                </div>
                <div className={`${s.message}`}>Welcome back !!!</div>
                <div className={`${s.title}`}>Sign Up</div>

                <div className={`${s.containerInput}`}>
                    <div className={`${s.containerInputText}`}>
                        <div className={`${s.textInputLeft}`}>Display Name</div>
                    </div>
                    <TextField
                        className={`${s.textfield}`}
                        variant="outlined"
                        size="small"
                        onChange={(event) => handleDisplayNameChange(event)} // Handle display name change
                        disabled={isLoading}
                    />
                </div>

                <div className={`${s.containerInput}`}>
                    <div className={`${s.containerInputText}`}>
                        <div className={`${s.textInputLeft}`}>Email</div>
                    </div>
                    <TextField
                        className={`${s.textfield}`}
                        variant="outlined"
                        size="small"
                        onChange={(event) => handleEmailChange(event)}
                        disabled={isLoading}
                    />
                </div>
                <div className={`${s.containerInput}`}>
                    <div className={`${s.containerInputText}`}>
                        <div className={`${s.textInputLeft}`}>Password</div>
                    </div>
                    <TextField
                        className={`${s.textfield}`}
                        variant="outlined"
                        size="small"
                        type="password"
                        onChange={(event) => handlePasswordChange(event)}
                        disabled={isLoading}
                    />
                </div>
                <div className={`${s.containerButton}`}>
                    <Button
                        className={`${s.buttonSubmit}`}
                        variant="contained"
                        color="primary"
                        onClick={handleSignUp}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                </div>
                <div className={`${s.containerCreateAccount}`}>
                    <text>Already have an account?</text>
                    <a href="/login">Log In</a>
                </div>
            </div>
        </div>
    );
}
