import { csrfFetch } from './csrf';
const SET_USER = 'sessions/SET_USER';
const REMOVE_USER = 'sessions/REMOVE_USER';

const setUser = (user) =>{
    return {
        type: SET_USER,
        payload: user
    }
}

const removeUser = ()=>{
    return{
        type: REMOVE_USER,
    }
}

export const login = (user) => async (dispatch) => {
    const {credential, password} = user;
    const response = await csrfFetch(
      '/api/session',
      {
        method: 'POST',
        body:JSON.stringify({
          credential,
          password,
        }),
      })
    const data = await response.json()
    dispatch (setUser(data.user));
    return response;
}


export const signup = (user) => async (dispatch) => {
  const { username, email, password } = user;

  try {
    const response = await csrfFetch('api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      // Handle the case where the response is not OK (e.g., server error)
      const data = await response.json();
      throw new Error(data.message || 'Failed to sign up');
    }

    const data = await response.json();
    dispatch(setUser(data.user));

    return response;
  } catch (error) {
    console.error('Error during signup:', error.message);
    throw error; // Rethrow the error for the calling code to handle if needed
  }
};


export const restoreUser = (user)=> async(dispatch)=>{
  const res = await csrfFetch(
    '/api/session',{
      method: "GET"
    }
  )

  const response = await res.json();
  dispatch(setUser(response.user))

  return res;


}




const initialState = {
  user: null,
};

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = {
        ...state,
        user: action.payload,
      };
      return newState;
    case REMOVE_USER:
      newState = {
        ...state,
        user: null, // Set user to null to remove the user
      };
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
