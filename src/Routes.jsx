import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";

const PageNotFound = loadable(() => import('Pages/ErrorPage/PageNotFound'));

const Address = loadable(() => import('Pages/Address'));
const Dashboard = loadable(() => import('Pages/Dashboard'));
const Fault = loadable(() => import('Pages/Fault'));
const Product = loadable(() => import('Pages/Product'));
const RoutePage = loadable(() => import('Pages/Route'));
const Setting = loadable(() => import('Pages/Setting'));
const SignIn = loadable(() => import('Pages/SignIn'));

const Planning = loadable(() => import('Pages/RouteOrder/Planning'));
const Operation = loadable(() => import('Pages/RouteOrder/Operation'));
const Finance = loadable(() => import('Pages/RouteOrder/Finance'));
const Reports = loadable(() => import('Pages/RouteOrder/Reports'));

const Laborcode = loadable(() => import('Pages/Maintenance/Laborcode'));
const Request = loadable(() => import('Pages/Maintenance/Request'));
const Scheduler = loadable(() => import('Pages/Maintenance/Scheduler'));
const Workorder = loadable(() => import('Pages/Maintenance/Workorder'));

const InspectionForm = loadable(() => import('Pages/Inspection/InspectionForm'));
const InspectionReport = loadable(() => import('Pages/Inspection/InspectionReport'));

const Truck = loadable(() => import('Pages/Vehicle/Truck'));
const Trailer = loadable(() => import('Pages/Vehicle/Trailer'));

const pagesWithoutAuthentication = [{id: "signin", path: "/SignIn", component: SignIn}];

const pagesWithAuthentication = [
    {id: "address", path: "/Address", component: Address},
    {id: "dashboard", path: "/Dashboard", component: Dashboard},
    {id: "fault", path: "/Fault", component: Fault},
    {id: "product", path: "/Product", component: Product},
    {id: "route", path: "/Route", component: RoutePage},
    {id: "setting", path: "/Setting", component: Setting},

    {id: "laborcode", path: "/Maintenance/Laborcode", component: Laborcode},
    {id: "request", path: "/Maintenance/Request", component: Request},
    {id: "scheduler", path: "/Maintenance/Scheduler", component: Scheduler},
    {id: "workorder", path: "/Maintenance/Workorder", component: Workorder},

    {id: "inspectionForm", path: "/Inspection/InspectionForm", component: InspectionForm},
    {id: "inspectionReport", path: "/Inspection/InspectionReport", component: InspectionReport},

    {id: "truck", path: "/Vehicle/Truck", component: Truck},
    {id: "trailer", path: "/Vehicle/Trailer", component: Trailer},

    {id: "planning", path: "/RouteOrder/Planning", component: Planning},
    {id: "operation", path: "/RouteOrder/Operation", component: Operation},
    {id: "finance", path: "/RouteOrder/Finance", component: Finance},
    {id: "reports", path: "/RouteOrder/Reports", component: Reports},
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
            <Redirect exact from="/" to={isAuthenticated ? "/Dashboard" : "/SignIn"}/>
            <Route component={PageNotFound}/>
        </Switch>
    );
};

export default Routes;