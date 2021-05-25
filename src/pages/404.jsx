import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Layout from "../components/Layout";
import config from "../../data/site-config";

class Page404 extends Component {
  render() {
    return (
      <Layout>
        <div>
          <Helmet title={`404 Page | ${config.siteTitle}`} />
          This is 404 page
        </div>
      </Layout>
    );
  }
}

export default Page404;
