import {Redirect, Route, Switch} from "react-router-dom";
import loadable from "@loadable/component";

const SignIn = loadable(() => import('Pages/SignIn'));
const PageNotFound = loadable(() => import('Pages/ErrorPage/PageNotFound'));

const Dashboard = loadable(() => import('Pages/Dashboard'));
const TripRoutes = loadable(() => import('Pages/TripRoutes'));
const TripRouteForm = loadable(() => import('Pages/TripRoutes/TripRouteForm'));

const RoutePlanner = loadable(() => import('Pages/RoutePlanner'));
const Planning = loadable(() => import('Pages/RoutePlanner/Planning/PlanningForm'));
const Finance = loadable(() => import('Pages/RoutePlanner/Finance/FinanceForm'));
const Operation = loadable(() => import('Pages/RoutePlanner/Operation/OperationForm'));

const Laborcode = loadable(() => import('Pages/Maintenance/Laborcode'));
const Request = loadable(() => import('Pages/Maintenance/Request'));
const Scheduler = loadable(() => import('Pages/Maintenance/Scheduler'));
const Workorder = loadable(() => import('Pages/Maintenance/Workorder'));

const Faults = loadable(() => import('Pages/Faults'));
const FaultForm = loadable(() => import('Pages/Faults/FaultForm'));

const Products = loadable(() => import('Pages/Products'));
const ProductForm = loadable(() => import('Pages/Products/ProductForm'));

const Addresses = loadable(() => import('Pages/Addresses'));
const AddressForm = loadable(() => import('Pages/Addresses/AddressForm'));
const Inspection = loadable(() => import('Pages/Inspection'));
const InspectionFormSection = loadable(() => import('Pages/Inspection/InspectionForms/Sections'));
const InspectionReport = loadable(() => import('Pages/Inspection/InspectionReport'));

const Vehicle = loadable(() => import('Pages/Vehicle'));
const Truck = loadable(() => import('Pages/Vehicle/Truck/TruckForm'));
const Trailer = loadable(() => import('Pages/Vehicle/Trailer/TrailerForm'));
const Setting = loadable(() => import('Pages/Setting'));

const pagesWithoutAuthentication = [{id: "signin", path: "/sign_in", component: SignIn}];

const pagesWithAuthentication = [
    {id: "dashboard", path: "/dashboard", component: Dashboard},

    {id: "tripRoutes", path: "/routes", component: TripRoutes},
    {id: "newTripRoute", path: "/routes/route", component: TripRouteForm},
    {id: "editTripRoute", path: "/routes/route/:id", component: TripRouteForm},

    {id: "routePlanner", path: "/route_planner/:tabIndex", component: RoutePlanner},
    {id: "newPlanning", path: "/planning", component: Planning},
    {id: "editPlanning", path: "/planning/:id", component: Planning},
    {id: "editOperation", path: "/operation/:id", component: Operation},
    {id: "editFinance", path: "/finance/:id", component: Finance},

    {id: "laborcode", path: "/Maintenance/Laborcode", component: Laborcode},
    {id: "request", path: "/Maintenance/Request", component: Request},
    {id: "scheduler", path: "/Maintenance/Scheduler", component: Scheduler},
    {id: "workorder", path: "/Maintenance/Workorder", component: Workorder},

    {id: "inspection", path: "/inspection/:tabIndex", component: Inspection},
    {id: "inspectionFormSection", path: "/inspection_form/:id", component: InspectionFormSection},
    {id: "newInspectionReport", path: "/inspection_report", component: InspectionReport},
    {id: "editInspectionReport", path: "/inspection_report/:id", component: InspectionReport},

    {id: "faults", path: "/faults", component: Faults},
    {id: "newFault", path: "/faults/fault", component: FaultForm},
    {id: "editFault", path: "/faults/fault/:id", component: FaultForm},

    {id: "products", path: "/products", component: Products},
    {id: "newProduct", path: "/products/product", component: ProductForm},
    {id: "editProduct", path: "/products/product/:id", component: ProductForm},

    {id: "addresses", path: "/addresses", component: Addresses},
    {id: "newAddress", path: "/addresses/address", component: AddressForm},
    {id: "editAddress", path: "/addresses/address/:id", component: AddressForm},

    {id: "vehicle", path: "/vehicle/:tabIndex", component: Vehicle},
    {id: "newTruck", path: "/truck", component: Truck},
    {id: "editTruck", path: "/truck/:id", component: Truck},
    {id: "newTrailer", path: "/trailer", component: Trailer},
    {id: "editTrailer", path: "/trailer/:id", component: Trailer},

    {id: "setting", path: "/setting", component: Setting}
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
            <Redirect exact from="/" to={isAuthenticated ? "/dashboard" : "/sign_in"}/>
            <Route component={PageNotFound}/>
        </Switch>
    );
};

export default Routes;