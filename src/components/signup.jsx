import React, { useState } from 'react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      // console.log(username, password);
      const response = await fetch('http://localhost:4000/signup', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
        credentials:'include',
      });

      if (response.ok) {
        // Signup successful, handle the response or perform any necessary actions
        console.log('Signup successful');
        window.location.href = 'http://localhost:3000';
      } else {
        // Signup failed, handle the error response
        console.log('Signup failed');
      }

      // Clear input fields after signup
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error) {
      // Handle any network or server errors
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {/* <h2>Signup</h2> */}
      <form className='form' onSubmit={handleSignup}>
        <label>
          Email:
          <input type="text" value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
