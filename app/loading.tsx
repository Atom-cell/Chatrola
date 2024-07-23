import React from "react";
import BoxLoader from "./components/BoxLoader";
const Loading = () => {
  return <div className="w-screen h-screen flex justify-center items-center text-4xl">
    <BoxLoader />
  </div>;
};

export default Loading;
