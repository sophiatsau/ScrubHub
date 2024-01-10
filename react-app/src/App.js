import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { authenticate } from "./store/session";

import Navigation from "./components/Navigation";
import Landing from "./components/Landing";
import ShopDetails from "./components/ShopDetails";
import ShopByCategory from "./components/ShopByCategory";
import ShopsViewAll from "./components/ShopsViewAll";
import UserProfile from "./components/UserProfile";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <div style={{height: "40px"}}/>
      {isLoaded && (<div className="main-container">
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/profile">
            <UserProfile />
          </Route>
          <Route exact path="/shops">
            <ShopsViewAll />
          </Route>
          <Route exact path="/shops/:shopId([0-9]{1,})">
            <ShopDetails />
          </Route>
          <Route exact path="/shops/:category">
            <ShopByCategory />
          </Route>
          <Route>404 Page Not Found</Route>
        </Switch>
      </div>)}
      <div style={{height: "15vh"}}/>
      < Footer />
    </>
  );
}

export default App;
