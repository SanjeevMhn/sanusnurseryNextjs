'use client'
import { ChangeEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideDialog, initialDialogState } from "../lib/dialog/dialogSlice";
import { FormEvent } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { TAuthState, login, setUserData } from "../lib/auth/authSlice";
import { showNotification } from "../lib/notifications/notificationSlice";
import { useRouter } from "next/navigation";
import api from "../service/interceptor/interceptor";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
    const dispatch = useDispatch();
    const authUser: TAuthState = useSelector((state: any) => state.auth);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [emailErr, setEmailErr] = useState<string | null>(null);
    const [passwordErr, setPasswordErr] = useState<string | null>(null);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const router = useRouter();

    const handleCloseLogin = () => {
        dispatch(hideDialog())
        setEmail(null);
        setPassword(null);
        setErrMsg(null);
    }

    const handleCheckEmail = (e: ChangeEvent<HTMLInputElement>) => {
        let emailInput = e.target.value;
        if (emailInput === '' || emailInput == null) {
            setEmailErr('Please enter email');
        } else {
            setEmail(emailInput);
            setEmailErr(null);
        }
    }

    const handleCheckPassword = (e: ChangeEvent<HTMLInputElement>) => {
        let passwordInput = e.target.value;
        if (passwordInput === '' || passwordInput == null) {
            setPasswordErr('Please enter password');
        } else {
            setPassword(passwordInput);
            setPasswordErr(null);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const config: AxiosRequestConfig = {
                method: 'post',
                url: `${baseUrl}/auth`,
                data: {
                    user_email: email,
                    user_password: password
                },
                withCredentials: true
            }
            const result: AxiosResponse = await axios(config);
            if (result.status == 200) {
                const data = result.data;
                const token = data.accessToken;
                dispatch(login(data.accessToken))
                handleCloseLogin();
                dispatch(showNotification({
                    message: 'User logged in successully',
                    type: 'success'
                }))
                
                window.location.reload();
                /*const userDataConfig: AxiosRequestConfig = {
                    method: 'get',
                    url: `${baseUrl}/auth/me`,
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }*/

                /*const userDataRes = await api.get(`${baseUrl}/auth/me`);
                if (userDataRes.status == 200) {
                    const userData = await userDataRes.data;
                    if (userData.user[0].user_role == 'admin') {
                        window.location.reload();
                        router.push('/admin');
                    } else {
                        window.location.reload();
                        router.push('/');
                    }
                    dispatch(setUserData({
                        user_id: userData.user[0].user_id,
                        user_name: userData.user[0].user_name,
                        user_email: userData.user[0].user_email,
                        user_img: userData.user[0].user_img,
                        authProvider: userData.user[0].authProvider,
                        is_admin: userData.user[0].user_role === 'admin' ? true : false
                    }))



                }*/

            }


        } catch (e: any) {
            console.error(e);
            setErrMsg(e.response.data.message);
        }
    }

    const onGoogleLogin = async (response: GoogleCredentialResponse) => {
        try {
            const auth = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-auth`, {
                token: response.credential,
                client_id: response.clientId
            });
            const authData = auth.data;
            dispatch(login(authData.accessToken));
            sessionStorage.setItem('google-token',authData.accessToken);
            handleCloseLogin();
            dispatch(showNotification({
                message: 'User logged in successfully',
                type: 'success'
            }));
            window.location.reload();
            /*const userDataRes = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
            if (userDataRes.status == 200) {
                const userData = await userDataRes.data;
                if (userData.user[0].user_role == 'admin') {
                    router.push('/admin');
                    window.location.reload();
                } else {
                    router.push('/');
                    window.location.reload();
                }
                dispatch(setUserData({
                    user_id: userData.user[0].user_id,
                    user_name: userData.user[0].user_name,
                    user_email: userData.user[0].user_email,
                    user_img: userData.user[0].user_img,
                    authProvider: userData.user[0].authProvider,
                    is_admin: userData.user[0].user_role === 'admin' ? true : false
                }))
            }*/
        } catch (err) {
            console.error(err);
        }
    }

    const onGoogleError = () => {

    }

    return (
        <>
            <div className="third-party-login flex flex-wrap justify-center gap-2 pb-[20px] border-b-2 border-[var(--card-color)] w-full">
                {/* <button className="btn-primary">Login with Google</button> */}
                <GoogleLogin onSuccess={onGoogleLogin} onError={onGoogleError} />
                {/* <button className="btn-outline-md">Login with Facebook</button> */}
            </div>
            <form className="login-form form-layout no-shadow floating-label pt-[20px]" onSubmit={handleSubmit}>
                {
                    errMsg !== null ? (
                        <h2 className="text-red-600 text-lg text-center">{errMsg}</h2>
                    ) : null
                }
                <div className="form-body">
                    <div className="form-row default">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" name="email" id="email" className={`form-control ${emailErr !== null ? 'border-red-500' : ''}`} onBlur={handleCheckEmail} onChange={handleCheckEmail} placeholder="Email" autoFocus required />
                            {emailErr !== null ? (<span className="text-red-600">
                                {emailErr}
                            </span>) : (null)}
                        </div>
                    </div>
                    <div className="form-row default">
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" name="password" id="password" className={`form-control ${passwordErr !== null ? 'border-red-500' : ''}`} onBlur={handleCheckPassword} onChange={handleCheckPassword} placeholder="Password" required />
                            {passwordErr !== null ? (<span className="text-red-600">
                                {passwordErr}
                            </span>) : (null)}
                        </div>
                    </div>
                    <div className="form-row ml-auto">
                        <div className="form-group">
                            <Link href="#" className="text-right text-[var(--card-color)] text-[15px] underline">Forgot Password?</Link>
                        </div>
                    </div>
                </div>
                <div className="form-actions flex-wrap">
                    <button type="reset" className="btn-outline-md" onClick={() => handleCloseLogin()}>Cancel</button>
                    <button type="submit" className="btn-primary">Login</button>
                </div>
            </form>
        </>
    )
}

export default LoginForm;
