import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { AuthContextValue, AuthProviderProps } from '@appTypes/authTypes';



const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const handleError = (error) => {
    console.error('Error:', error);
  };

  //always check if logged in and authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      checkUserStatus();
    }
  }, [isLoggedIn]);

 const checkUserStatus = async () => {
    try {
      await fetchRm();
      const isAuthenticated = await checkAuthentication();
      if (isAuthenticated) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/validate', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        setIsLoggedIn(false);
        setLoggedInUser('');
        return false; // User is not authenticated
      }

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        setLoggedInUser(data.userInfo.username);
        return true; // User is authenticated
      }
      return false; // Handle other response statuses if needed
    } catch (error) {
      handleError(error);
      return false; // An error occurred while checking authentication
    }
  };


  //check remember me cookie
  const fetchRm = async () => {
    try {
      const rememberMeResponse = await fetch('/api/crm', {
        method: 'GET',
        credentials: 'include',
      });
      const rememberMeData = await rememberMeResponse.json();
      setLoggedInUser(rememberMeData.username);
      setIsLoggedIn(rememberMeData.valid);
    } catch (error) {
      console.error('Error checking "Remember Me" status:', error);
    }
  }

  //login
  const handleLogin = async (username, password, rememberMe, onSuccess) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, rememberMe }),
        credentials: 'include',
      });
      const data = await response.json();

      if (response.status !== 200) {
        setErrorMsg(data.message);
        return;
      }

      if (data.message === 'logged in') {
        setIsLoggedIn(true);
        checkAuthentication();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setIsLoggedIn(false);
        setErrorMsg('Unknown error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Network error. Please try again later.');
    }
  };

  //logout
  const handleLogout = async (onSuccess) => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.message === 'Logged out successfully') {
        setIsLoggedIn(false);
        setLoggedInUser('');
        if (onSuccess) {
          onSuccess();
        }
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  //signup
  const handleSignup = async (username, email, password, firstname, lastname, rememberMe, onSuccess) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, firstname, lastname }),
        credentials: 'include',
      });

      if (response.ok) {
        setErrorMsg('');  // Clearing any previous error messages
        console.log('Signup successful');
        handleLogin(username, password, rememberMe, onSuccess);
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('An error occurred. Please try again.');
    }
  };

  //change password
  const changePass = async (username, email, passwordOld, passwordNew) => {
    try {
      const response = await fetch('/api/acct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, passwordOld, passwordNew }),
        credentials: 'include',
      });

      if (response.ok) {
        // console.log('pw changed successful');
        return 'pw changed successful';
      } else {
        // console.log('pw change failed');
        throw new Error('pw change failed');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  //delete account
  const deleteAcct = async (username, email, password) => {
    try {
      const response = await fetch('/api/deleteacct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });
      if (response.ok) {
        return 'successfully deleted account';
      } else {
        const data = await response.json();
        return data.error || 'account deletion failed';
      }
    } catch (err) {
      console.error(err);
      return 'account deletion failed due to an error';
    }
  }


  const value: AuthContextValue = useMemo(() => ({
    errorMsg,
    setErrorMsg,
    isLoggedIn,
    changePass,
    deleteAcct,
    loggedInUser,
    handleLogout,
    handleLogin,
    handleSignup,
    userDetails
  }), [isLoggedIn, loggedInUser, errorMsg]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


