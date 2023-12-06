import LoginFormPage from "./store/components/LoginFormPage";
import { Route, Switch } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreUser } from "./store/session";
import SignUpForm from "./store/components/SignupFormPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return isLoaded && (
    <>
    <Switch>
      <Route path="/login">
            <LoginFormPage />
      </Route>
      <Route path="/signup">
            <SignUpForm />
      </Route>
    </Switch>

    </>
  );
}

export default App;
