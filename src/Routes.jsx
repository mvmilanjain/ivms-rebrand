import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";

const Address = loadable(() => import('Pages/Address'));
const Dashboard = loadable(() => import('Pages/Dashboard'));
const Demo = loadable(() => import('Pages/Demo'));
const Fault = loadable(() => import('Pages/Fault'));
const Product = loadable(() => import('Pages/Product'));
const RoutePage = loadable(() => import('Pages/Route'));
const Setting = loadable(() => import('Pages/Setting'));
const SignIn = loadable(() => import('Pages/SignIn'));

const Truck = loadable(() => import('Pages/Vehicle/Truck'));
const Trailer = loadable(() => import('Pages/Vehicle/Trailer'));

const Planning = loadable(() => import('Pages/RoutePlanner/Planning'));
const Operation = loadable(() => import('Pages/RoutePlanner/Operation'));
const Finance = loadable(() => import('Pages/RoutePlanner/Finance'));
const Reports = loadable(() => import('Pages/RoutePlanner/Reports'));

const pagesWithoutAuthentication = [
    {id: "signin", path: "/signin", component: SignIn},
    {id: "demo", path: "/demo", component: Demo}
];

const pagesWithAuthentication = [
    {id: "address", path: "/address", component: Address},
    {id: "dashboard", path: "/dashboard", component: Dashboard},
    {id: "fault", path: "/fault", component: Fault},
    {id: "product", path: "/product", component: Product},
    {id: "route", path: "/route", component: RoutePage},
    {id: "setting", path: "/setting", component: Setting},

    {id: "truck", path: "/truck", component: Truck},
    {id: "trailer", path: "/trailer", component: Trailer},

    {id: "planning", path: "/route_order_planning", component: Planning},
    {id: "operation", path: "/route_order_operation", component: Operation},
    {id: "finance", path: "/route_order_finance", component: Finance},
    {id: "reports", path: "/route_order_reports", component: Reports},
];

const Routes = ({isAuthenticated}) => {
    const pages = isAuthenticated ? pagesWithAuthentication : pagesWithoutAuthentication;
    const getRoutes = () => pages.map((page) => <Route
        key={page.id} id={page.id} exact
        path={page.path} component={page.component}
    />);

    return (
        <Switch>
            {getRoutes()}
            <Redirect exact from="/" to={isAuthenticated ? "/dashboard" : "/signin"}/>
        </Switch>
    );
};

export default Routes;