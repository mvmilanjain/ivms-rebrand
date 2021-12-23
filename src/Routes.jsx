import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";

const SignIn = loadable(() => import('Pages/SignIn'));
const PageNotFound = loadable(() => import('Pages/ErrorPage/PageNotFound'));

const Dashboard = loadable(() => import('Pages/Dashboard'));
const TripRoute = {
    ViewAll: loadable(() => import('Pages/TripRoutes')),
    NewOrEdit: loadable(() => import('Pages/TripRoutes/TripRouteForm'))
};
const RoutePlanner = loadable(() => import('Pages/RoutePlanner'));
const Finance = loadable(() => import('Pages/RoutePlanner/Finance/FinanceForm'));
const Laborcode = loadable(() => import('Pages/Maintenance/Laborcode'));
const Request = loadable(() => import('Pages/Maintenance/Request'));
const Scheduler = loadable(() => import('Pages/Maintenance/Scheduler'));
const Workorder = loadable(() => import('Pages/Maintenance/Workorder'));
const Fault = {
    ViewAll: loadable(() => import('Pages/Faults')),
    NewOrEdit: loadable(() => import('Pages/Faults/FaultForm'))
};
const Product = {
    ViewAll: loadable(() => import('Pages/Products')),
    NewOrEdit: loadable(() => import('Pages/Products/ProductForm'))
};
const Address = {
    ViewAll: loadable(() => import('Pages/Addresses')),
    NewOrEdit: loadable(() => import('Pages/Addresses/AddressForm'))
};
const InspectionForm = loadable(() => import('Pages/Inspection/InspectionForm'));
const InspectionReport = loadable(() => import('Pages/Inspection/InspectionReport'));
const Vehicle = loadable(() => import('Pages/Vehicle'));
const Truck = {
    NewOrEdit: loadable(() => import('Pages/Vehicle/Truck/TruckForm'))
};
const Trailer = {
    NewOrEdit: loadable(() => import('Pages/Vehicle/Trailer/TrailerForm'))
};
const Setting = loadable(() => import('Pages/Setting'));

const pagesWithoutAuthentication = [{id: "signin", path: "/SignIn", component: SignIn}];

const pagesWithAuthentication = [
    {id: "dashboard", path: "/Dashboard", component: Dashboard},

    {id: "tripRoutes", path: "/TripRoutes", component: TripRoute.ViewAll},
    {id: "newTripRoute", path: "/TripRoutes/Route", component: TripRoute.NewOrEdit},
    {id: "editTripRoute", path: "/TripRoutes/Route/:id", component: TripRoute.NewOrEdit},

    {id: "routePlanner", path: "/RoutePlanner/:tabIndex", component: RoutePlanner},
    {id: "routePlannerFinance", path: "/Finance/:id", component: Finance},

    {id: "laborcode", path: "/Maintenance/Laborcode", component: Laborcode},
    {id: "request", path: "/Maintenance/Request", component: Request},
    {id: "scheduler", path: "/Maintenance/Scheduler", component: Scheduler},
    {id: "workorder", path: "/Maintenance/Workorder", component: Workorder},

    {id: "inspectionForm", path: "/Inspection/InspectionForm", component: InspectionForm},
    {id: "inspectionReport", path: "/Inspection/InspectionReport", component: InspectionReport},

    {id: "faults", path: "/Faults", component: Fault.ViewAll},
    {id: "newFault", path: "/Faults/Fault", component: Fault.NewOrEdit},
    {id: "editFault", path: "/Faults/Fault/:id", component: Fault.NewOrEdit},

    {id: "products", path: "/Products", component: Product.ViewAll},
    {id: "newProduct", path: "/Products/Product", component: Product.NewOrEdit},
    {id: "editProduct", path: "/Products/Product/:id", component: Product.NewOrEdit},

    {id: "addresses", path: "/Addresses", component: Address.ViewAll},
    {id: "newAddress", path: "/Addresses/Address", component: Address.NewOrEdit},
    {id: "editAddress", path: "/Addresses/Address/:id", component: Address.NewOrEdit},

    {id: "vehicle", path: "/Vehicle/:tabIndex", component: Vehicle},

    {id: "newTruck", path: "/Truck", component: Truck.NewOrEdit},
    {id: "editTruck", path: "/Truck/:id", component: Truck.NewOrEdit},

    {id: "newTrailer", path: "/Trailer", component: Trailer.NewOrEdit},
    {id: "editTrailer", path: "/Trailer/:id", component: Trailer.NewOrEdit},

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