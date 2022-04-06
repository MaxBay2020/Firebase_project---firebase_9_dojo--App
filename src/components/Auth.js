import React, {useEffect} from 'react'

import {initializeApp} from "firebase/app";
import firebaseConfig from '../config/firebase-config'
import {
    getFirestore
} from 'firebase/firestore'
import {
    getAuth, // 注册、登录以及登出都是用这个方法
    createUserWithEmailAndPassword, // 使用邮箱和密码注册用户
    signOut,                        // 登出用户
    signInWithEmailAndPassword,     // 登录用户
    onAuthStateChanged,             // 当auth状态改变时触发里面的函数，如用户登录或登出了
} from 'firebase/auth'


const Auth = () => {
    // 链接数据库
    initializeApp(firebaseConfig)
    const db = getFirestore()

    const auth = getAuth()

    // 使用邮箱和密码注册用户
    const email = 'wangxiaobei666@hotmail.com'
    const password = '123456'
    const register = async () => {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        console.log('user created: ', credential.user)
    }

    // 登出用户
    const logout = async () => {
        await signOut(auth)
        console.log('the user logged out!')
    }

    // 登录用户
    const login = async () => {
        const loggedUser = await signInWithEmailAndPassword(auth, email, password)
        console.log('the user logged in!', loggedUser.user)
    }

    // 一般情况下，我们将监控写在useEffect中，并设置cleanup函数，从而避免内存泄漏
    useEffect(() => {
        // 当auth状态发生变化时，就会触发第二个参数中的函数；如用户登录/登出了
        // 监控auth的状态
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            console.log('user status changed: ', user)
        })

        return unsubAuth() // cleanup函数，取消监控
    }, []);


    return (
        <div>
            <h3>Firebase Authentication</h3>
            <button onClick={()=>register()}>Register</button>
            <button onClick={()=>logout()}>Logout</button>
            <button onClick={()=>login()}>Login</button>
        </div>
    );
};

export default Auth;


