import LoginFormPage from "./store/components/LoginFormPage";
import { Route } from "react-router-dom";

function App() {
  return (
    <>
    <Route path="/login">
            <LoginFormPage />
    </Route>
    </>
  );
}

export default App;
