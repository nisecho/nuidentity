import React, { useState, useEffect} from "react";
import { TextField } from "@mui/material";
import s from "./Login.module.css";
import p from '../pages.module.css'
import {
    getAuth,
    getMultiFactorResolver,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
    signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dataUsed, setDataUsed] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    const handleLoginFormClick = async () => {
        setDataUsed(true);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // no 2fa <3
                // eslint-disable-next-line no-restricted-globals
                if (userCredential.user.emailVerified) {
                    // eslint-disable-next-line no-restricted-globals
                    if (confirm("No 2fa set up, would you like to set one up?") === true) {
                        navigate("../../Verification");
                        return;
                    }
                }
                navigate("../../home");
            })
            .catch((error) => {
                console.log(error)
                if (error.code === 'auth/invalid-email') {
                    alert("Account not found!");
                    navigate('/signup')
                }
                if (error.code === 'auth/invalid-login-credentials') {
                    alert("Invalid Email or Password");
                }
                if (error.code === 'auth/multi-factor-auth-required') {
                    // Send SMS verification code
                    sendCode(error)
                }
            });
        setDataUsed(false);
    };

    const sendCode = async (error) => {
        const resolver = getMultiFactorResolver(auth, error);
        const phoneInfoOptions = {
            multiFactorHint: resolver.hints[0],
            session: resolver.session
        };
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions)
            .then(function (verificationId) {
                // Ask user for the SMS verification code. Then:
                let code = prompt("Enter SMS Code: ")
                const cred = PhoneAuthProvider.credential(
                    verificationId, code);
                const multiFactorAssertion =
                    PhoneMultiFactorGenerator.assertion(cred);
                // Complete sign-in.
                return resolver.resolveSignIn(multiFactorAssertion)
            })
            .then(function () {
                navigate("../../Home");
            }).catch(error => {
                console.log(error)
                // eslint-disable-next-line no-restricted-globals
                if (confirm("Invalid or expired code. Try again?") === true) {
                    handleLoginFormClick()
                }
            })
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div className={p.page}>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
            </style>
            <div className={s.container}>
                <div className={s.containerImage}>
                    <img className={s.logo} src="/logo.png" alt={'Nuidentity'} height="60px"/>
                </div>
                <div className={s.message}>Welcome back !!!</div>
                <div className={s.title}>Sign In</div>
                <div className={s.containerInput}>
                    <div className={s.containerInputText}>
                        <div className={s.textInputLeft}>Email</div>
                    </div>
                    <TextField className={s.textfield} variant="outlined" size="small" onChange={(event) => handleEmailChange(event)}
                               disabled={dataUsed === true}/>
                </div>
                <div className={s.containerInput}>
                    <div className={s.containerInputText}>
                        <div className={s.textInputLeft}>Password</div>
                    {/*    <a href="/resetpassword" className={s.textInputRight}>Forgot Password?</a>*/}
                    </div>
                    <TextField className={s.textfield} variant="outlined" size="small" type="password" onChange={(event) => handlePasswordChange(event)}
                               disabled={dataUsed === true}/>
                </div>
                <div className={s.containerButton}>
                    <button className={s.buttonSubmit} onClick={handleLoginFormClick}
                            disabled={dataUsed === true}>SIGN IN -{">"}
                    </button>
                </div>
                <div className={s.containerCreateAccount}>
                    <text>Don't have an account?</text>
                    <a href="/signup">
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
}
