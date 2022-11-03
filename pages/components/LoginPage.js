import React, { useState } from 'react'
import styles from '../../styles/LoginPage.module.css'
import firebase from '../../config/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router'

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
       
        const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // window.location.href = "/components/Dashboard"
                router.push('/components/Dashboard');
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    
        return (
            <>
                <div className={styles.LoginBox}>
                    <div className={styles.box}>
                        <div className={styles.form}>
                            <h2>Login</h2>
                            <div className={styles.inputBox}>
                                <input 
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text" 
                                    required 
                                />
                                <span>Username</span>
                                <i></i>
                            </div>
                            <div className={styles.inputBox}>
                                <input 
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password" 
                                    required 
                                />
                                <span>Password</span>
                                <i></i>
                            </div>
                            <div className={styles.links}>
                                <a href="#">Forgot Password ?</a>
                                <a href="#">SignUp</a>
                            </div>
                            <button onClick={handleLogin} className={styles.button}><span>LOGIN</span></button>
                        </div>
                    </div>
                </div>
            </>
        )
    
}
