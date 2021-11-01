import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";

// SignIn
const SignIn = loadable(() => import("Pages/SignIn"));

// Dashboard
const Dashboard = loadable(() => import("Pages/Dashboard"));

const pagesWithoutAuthentication = [
    {id: "signin", path: "/signin", component: SignIn}
];

const pagesWithAuthentication = [
    {id: "dashboard", path: "/dashboard", component: Dashboard}
];

const Routes = ({isAuthenticated}) => {
    const pages = isAuthenticated ? pagesWithAuthentication : pagesWithoutAuthentication;
    const getRoutes = () => pages.map((page) => <Route
        key={page.id}
        id={page.id}
        exact path={page.path}
        component={page.component}
    />);

    return (
        <Switch>
            {getRoutes()}
            <Redirect exact from="/" to={isAuthenticated ? "/dashboard" : "/signin"}/>
        </Switch>
    );
};

export default Routes;