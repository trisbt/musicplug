import React from 'react';

export interface AuthContextValue {
    errorMsg: string;
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
    isLoggedIn: boolean;
    changePass: (username: string, email: string, passwordOld: string, passwordNew: string) => Promise<string>;
    deleteAcct: (username: string, email: string, password: string) => Promise<string>;
    loggedInUser: string;
    handleLogout: (onSuccess?: () => void) => Promise<void>;
    handleLogin: (username: string, password: string, rememberMe: boolean, onSuccess?: () => void) => Promise<void>;
    handleSignup: (username: string, email: string, password: string, firstname: string, lastname: string) => Promise<void>;
    userDetails: Record<string, any>;
}
export interface CopyrightProps {
    children?: ReactNode;
    [key: string]: any;
}
export interface AuthProviderProps {
    children: React.ReactNode;
}
