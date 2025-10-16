import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/route";

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
