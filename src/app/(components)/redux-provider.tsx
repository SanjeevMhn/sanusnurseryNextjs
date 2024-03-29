"use client"

import { store } from "../lib/store";
import React, { ReactNode, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from "react-redux";
import NotificationList from "./notification-list";
import ConfrimationContainer from "./confirmation-container";
import Dialog from "./dialog";
import axios, { AxiosRequestConfig } from "axios";
import { setUserData } from "../lib/auth/authSlice";
import { injectStore } from "../service/interceptor/interceptor";
import Header from "./Header";
import Link from "next/link";
import SideNav from "./sidenav";
import OrderPDFView from "./orderPDFView";
import { GoogleOAuthProvider } from "@react-oauth/google";

injectStore(store);

type ReduxProviderType = {
    children: ReactNode
}

const clientId = process.env.NEXT_PUBLIC_GOOGLE_ID ?? '';

export default function ReduxProvider({ children }: ReduxProviderType) {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Provider store={store}>
                <Header />
                <section className="child-container">
                    {children}
                </section>
                <NotificationList />
                <ConfrimationContainer />
                <Dialog />
                <OrderPDFView />
            </Provider>
        </GoogleOAuthProvider>
    )
}
