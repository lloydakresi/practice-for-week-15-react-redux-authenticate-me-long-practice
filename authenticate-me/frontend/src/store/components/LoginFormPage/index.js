import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../session'
import './LoginForm.css';

const LoginFormPage = ()=>{
    const dispatch = useDispatch();

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const sessionUser = useSelector(state => state.session.user);

    if (sessionUser){
        return (
        <Redirect to='/' />
    )};

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        const user = {
          credential,
          password
        }
        return dispatch(login(user))
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
          });
    };





    return(
        <>
          <h2>Login Form</h2>
          <form onSubmit={onSubmit}>
            <div className='container'>
            <ul>
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <label>
              <b>Username or Email:</b>
              <input
                type='text'
                value={credential}
                placeholder='username or email'
                onChange={(e) => setCredential(e.target.value)}
                //name = 'credential'
                required
              />
            </label>
            <label>
              <b>Password:</b>
              <input
                type='password'
                value={password}
                placeholder='password'
                onChange={(e) => setPassword(e.target.value)}
                //name = 'password'
                required
              />
            </label>
            <button type="submit">Log In</button>
            </div>
          </form>
        </>
      )

}

export default LoginFormPage;
