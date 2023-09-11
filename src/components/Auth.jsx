import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [userDetails, setUserDetails] = useState({});
  //state for redirects
  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [successfulLogout, setSuccessfulLogout] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');


  //always check if logged in and authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      checkUserStatus();
    }
  }, [isLoggedIn]);

  const checkUserStatus = async () => {
    try {
      await fetchRm();
      await checkAuthentication();
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };


  //check for session
  const checkAuthentication = async () => {
    try {
      const response = await fetch('/validate', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.message === 'user validated') {
        //update here
        setUserDetails(data);
        setIsLoggedIn(true);
        setLoggedInUser(data.userInfo.username);
        // setIsLoggedIn(true);
        setSuccessfulLogin(true);
      } else {

        setIsLoggedIn(false);
        setLoggedInUser('');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);

      setIsLoggedIn(false);
      setLoggedInUser('');
    }
  }

  //check remember me cookie
  const fetchRm = async () => {
    try {
      const rememberMeResponse = await fetch('/check-remember-me', {
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
  const handleLogin = async (username, password, rememberMe) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, rememberMe }),
        credentials: 'include',
      });
      const data = await response.json();
      
      if (response.status !== 200) {
        setErrorMsg(data.message); // Assuming the error message is under the "error" key in the response
        return;
      }
      
      if (data.message === 'logged in') {
        setIsLoggedIn(true);
        checkAuthentication();
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
  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
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
        setSuccessfulLogout(true);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  //signup
  const handleSignup = async (username, email, password, firstname, lastname) => {
    try {
      const response = await fetch('/signup', {
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
        handleLogin(username, password);
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
      const response = await fetch('/acct', {
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
  const deleteAcct = async(username, email, password) => {
    try {
      const response = await fetch('/deleteacct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });
      if (response.ok) {
        // handleLogout()
        return 'successfully deleted account';
      } else {
        throw new Error('account deletion failed');
      }
    }catch(err){

    }
  }

  const value = useMemo(() => ({
    errorMsg,
    setErrorMsg,
    isLoggedIn,
    changePass,
    deleteAcct,
    loggedInUser,
    handleLogout,
    handleLogin,
    handleSignup,
    successfulLogin,
    setSuccessfulLogin,
    successfulLogout,
    setSuccessfulLogout,
    userDetails
  }), [isLoggedIn, loggedInUser, successfulLogin, successfulLogout, errorMsg]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
