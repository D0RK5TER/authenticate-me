// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import SignupFormPage from "./components/SignUpFormPage";
import LoginFormPage from './components/LoginFormPage';
import { restoreUser } from './store/session';
import Navigation from './components/Navigation';

function App() {
  // const dispatch = useDispatch();
  // const [isLoaded, setIsLoaded] = useState(false);
  // useEffect(() => {
  //   dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  // }, [dispatch]);
  ///////v this for return /// ^this for auth /// docs
  // isLoaded && 
  useEffect(() => {
    restoreUser()
  }, [])


  return (
    // <h1>FairRnR</h1>
    <>
      <Navigation />

      <Switch>
        {/* <Route exact path="/">
        <h1>Welcome Home Buckaroo!</h1>
      </Route> */}
        <Route path="/signup">
          <SignupFormPage />
        </Route>
        <Route path="/login">
          <LoginFormPage />
        </Route>
      </Switch>
    </>

  );
}

export default App;