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
