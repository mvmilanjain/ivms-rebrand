import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";

const SignIn = loadable(() => import('Pages/SignIn'));
const PageNotFound = loadable(() => import('Pages/ErrorPage/PageNotFound'));

const Dashboard = loadable(() => import('Pages/Dashboard'));
const RoutePage = {
    ViewAll: loadable(() => import('Pages/Route')),
    NewOrEdit: loadable(() => import('Pages/Route/NewOrEditRoute'))
};
const RoutePlanner = loadable(() => import('Pages/RoutePlanner'));
const Finance = loadable(() => import('Pages/RoutePlanner/Finance/FinanceForm'));
const Laborcode = loadable(() => import('Pages/Maintenance/Laborcode'));
const Request = loadable(() => import('Pages/Maintenance/Request'));
const Scheduler = loadable(() => import('Pages/Maintenance/Scheduler'));
const Workorder = loadable(() => import('Pages/Maintenance/Workorder'));
const Fault = {
    ViewAll: loadable(() => import('Pages/Fault')),
    NewOrEdit: loadable(() => import('Pages/Fault/NewOrEditFault'))
};
const Product = {
    ViewAll: loadable(() => import('Pages/Product')),
    NewOrEdit: loadable(() => import('Pages/Product/NewOrEditProduct'))
};
const Address = {
    ViewAll: loadable(() => import('Pages/Address')),
    NewOrEdit: loadable(() => import('Pages/Address/NewOrEditAddress'))
};
const InspectionForm = loadable(() => import('Pages/Inspection/InspectionForm'));
const InspectionReport = loadable(() => import('Pages/Inspection/InspectionReport'));
const Vehicle = loadable(() => import('Pages/Vehicle'));
const Truck = {
    NewOrEdit: loadable(() => import('Pages/Vehicle/Truck/NewOrEditTruck'))
};
const Trailer = {
    NewOrEdit: loadable(() => import('Pages/Vehicle/Trailer/NewOrEditTrailer'))
};
const Setting = loadable(() => import('Pages/Setting'));

const pagesWithoutAuthentication = [{id: "signin", path: "/SignIn", component: SignIn}];

const pagesWithAuthentication = [
    {id: "dashboard", path: "/Dashboard", component: Dashboard},

    {id: "route", path: "/Route", component: RoutePage.ViewAll},
    {id: "newRoute", path: "/Route/New", component: RoutePage.NewOrEdit},
    {id: "editRoute", path: "/Route/Edit/:id", component: RoutePage.NewOrEdit},

    {id: "routePlanner", path: "/RoutePlanner/:tabIndex", component: RoutePlanner},
    {id: "routePlannerFinance", path: "/RoutePlanner/Finance/:id", component: Finance},

    {id: "laborcode", path: "/Maintenance/Laborcode", component: Laborcode},
    {id: "request", path: "/Maintenance/Request", component: Request},
    {id: "scheduler", path: "/Maintenance/Scheduler", component: Scheduler},
    {id: "workorder", path: "/Maintenance/Workorder", component: Workorder},

    {id: "inspectionForm", path: "/Inspection/InspectionForm", component: InspectionForm},
    {id: "inspectionReport", path: "/Inspection/InspectionReport", component: InspectionReport},

    {id: "fault", path: "/Fault", component: Fault.ViewAll},
    {id: "newFault", path: "/Fault/New", component: Fault.NewOrEdit},
    {id: "editFault", path: "/Fault/Edit/:id", component: Fault.NewOrEdit},

    {id: "product", path: "/Product", component: Product.ViewAll},
    {id: "newProduct", path: "/Product/New", component: Product.NewOrEdit},
    {id: "editProduct", path: "/Product/Edit/:id", component: Product.NewOrEdit},

    {id: "address", path: "/Address", component: Address.ViewAll},
    {id: "newAddress", path: "/Address/New", component: Address.NewOrEdit},
    {id: "editAddress", path: "/Address/Edit/:id", component: Address.NewOrEdit},

    {id: "vehicle", path: "/Vehicle", component: Vehicle},
    {id: "newTruck", path: "/Vehicle/Truck/New", component: Truck.NewOrEdit},
    {id: "editTruck", path: "/Vehicle/Truck/Edit/:id", component: Truck.NewOrEdit},

    {id: "newTrailer", path: "/Vehicle/Trailer/New", component: Trailer.NewOrEdit},
    {id: "editTrailer", path: "/Vehicle/Trailer/Edit/:id", component: Trailer.NewOrEdit},

    {id: "setting", path: "/Setting", component: Setting}
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