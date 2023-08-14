import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const[logout, setLogout] = useState(false);


    useEffect(() => {
        checkAuthentication();
    }, []);
    async function checkAuthentication() {
        try {
            const response = await fetch('http://localhost:4000/validate', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.message === 'user validated') {
                const userCookie = Cookies.get('plug');
                const userData = JSON.parse(userCookie);
                setIsValidated(true);
                setLogout(false);
                setLoggedInUser(userData.username);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
        }
    }
    const handleLogin = async (username, password) => {

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.message === 'logged in') {           
                setIsLoggedIn(true);
                setLoggedInUser(username);
                Cookies.set('plug', JSON.stringify(data.user));
                checkAuthentication();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setIsLoggedIn(false);
            setLoggedInUser('');
            setLogout(true);
            Cookies.remove('plug');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSignup = async (username, email, password, firstname, lastname) => {

            try {
              const response = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, firstname, lastname }),
                credentials:'include',
              });
        
              if (response.ok) {
                console.log('Signup successful');
                handleLogin(username, password);
              } else {
                console.log('Signup failed');
              }
            } catch (error) {
              console.error('Error:', error);
            }
          };


    const value = useMemo(() => ({
        isLoggedIn,
        loggedInUser,
        handleLogout,
        handleLogin,
        handleSignup,
        isValidated,
        logout,
        
    }), [isLoggedIn, loggedInUser, isValidated, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
