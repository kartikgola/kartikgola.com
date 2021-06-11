import React from "react";
import { Helmet } from "react-helmet";

import Layout from "../components/Layout";
import Nav from "../components/Nav";
import config from "../../site-config";
import UserInfo from "../components/UserInfo";

export default class Home extends React.Component {
  render() {
    return (
      <Layout>
        <Helmet title={config.siteTitle} />
        <UserInfo config={config} />
      </Layout>
    );
  }
};
