import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../session';
import './SignupForm.css';
import { Redirect } from 'react-router-dom';

const SignUpForm = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  // Redirect if user is already logged in


  // Move useState to the top level
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState([]);
  if (sessionUser) {
    return <Redirect to="/" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password === userData.confirmPassword) {
      setError([]);
      const { username, email, password } = userData;
      try {
        await dispatch(signup({ username, email, password }));
        // Redirect to the home page after successful signup
        // This assumes that the signup action performs the login as well
      } catch (res) {
        const data = await res.json();
        if (data && data.errors) setError(data.errors);
      }
    } else {
      setError(['Confirm Password field should be the same as Password field']);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Username input */}
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleInputChange}
        />
      </label>

      {/* Email input */}
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
        />
      </label>

      {/* Password input */}
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
        />
      </label>

      {/* Confirm Password input */}
      <label>
        Confirm Password:
        <input
          type="password"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleInputChange}
        />
      </label>

      {/* Display error messages */}
      {error.length > 0 && (
        <div style={{ color: 'red', marginTop: '5px' }}>
          {error.map((errorMsg, index) => (
            <div key={index}>{errorMsg}</div>
          ))}
        </div>
      )}

      {/* Submit button */}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
