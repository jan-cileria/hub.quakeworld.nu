import { SiteFooter } from "@qwhub/site/Footer";
import { SiteHeader } from "@qwhub/site/Header";
import React from "react";

export const App = () => {
  return (
    <>
      <SiteHeader />
      <div className="mt-4 mb-6">
        <h1>Hello World</h1>
      </div>
      <SiteFooter />
    </>
  );
};

export default App;

