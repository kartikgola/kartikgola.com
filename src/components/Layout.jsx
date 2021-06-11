
import { Helmet } from "react-helmet";
import React, { Component } from "react";

import Footer from "./Footer";
import Nav from "./Nav";
import config from "../../site-config";
import SEO from "./SEO";

export default class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className="bg-gradient-to-b from-red-300 via-green-400 to-blue-500 mx-auto font-mono">
        <Helmet>
          <meta name="description" content={config.siteDescription} />
          <html lang="en" />
        </Helmet>
        <SEO />
        <main className="h-screen grid items-center">
            {children}
        </main>
        <Footer config={config} />
      </div>
    );
  }
}
