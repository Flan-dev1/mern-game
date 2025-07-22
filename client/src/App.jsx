import React from "react";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="h-dvh w-full p-5 text-white flex flex-col">
      <h2 className="text-center text-4xl font-semibold p-4 mb-2">Name Game</h2>
      <p className="text-center mb-6">Enter a name and it will replace a random name. The oldest entry will place on top</p>
      <div className="w-full flex justify-center">
        <div className="w-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default App;
