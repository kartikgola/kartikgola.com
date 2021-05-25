import React from "react";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";

import Layout from "../components/Layout";
import config from "../../data/site-config";
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

/* eslint no-undef: "off" */
// export const recentListingQuery = graphql`
//   query RecentListingQuery($limit: Int!) {
//     allMarkdownRemark(
//       sort: { fields: [fields___date], order: DESC }
//       limit: $limit
//     ) {
//       edges {
//         node {
//           fields {
//             slug
//           }
//           frontmatter {
//             title
//             tags
//             date
//           }
//         }
//       }
//     }
//   }
// `;