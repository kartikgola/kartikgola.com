
import { Helmet } from "react-helmet";
import React, { Component } from "react";

import Footer from "./Footer";
import Nav from "./Nav";
import config from "../../data/site-config";
import SEO from "./SEO";

export default class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className="bg-gradient-to-r from-green-400 to-blue-500 mx-auto">
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
