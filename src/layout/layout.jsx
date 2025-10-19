import { Outlet } from "react-router-dom";

const Layout = () => {  
    return <div className="min-h-screen p-5 pt-9 flex justify-center"><Outlet /></div>;
};

export default Layout;