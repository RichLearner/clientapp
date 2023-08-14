import React from "react";
import { BrowserRouter, Router, Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RatingForm from './components/RatingForm';
import ThankYou from './components/ThankYou';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/rating/:receipt/:chitId/:caddyId" component={RatingForm} />
                <Route path="/landing/:receipt" component={LandingPage} />
                <Route path="/thank-you" component={ThankYou} />
                <Route exact path="/">
                    <Redirect to="/landing/default-receipt" />
                </Route>
                {/* Add a catch-all route for undefined paths */}
                <Route path="*">
                    <Redirect to="/landing/default-receipt" />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
