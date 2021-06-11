import React, { Component } from "react";
import { OutboundLink } from "gatsby-plugin-google-gtag";

export default class SocialLinks extends Component {
    render() {
        const { config } = this.props;
        const { userLinks } = config;
        return (
            <div className="flex justify-between space-x-5 mt-4">
                {
                    userLinks.map(linkInfo => (
                        <OutboundLink className="hover:scale-75" key={linkInfo.label} href={linkInfo.url} target="_blank">
                            <img src={linkInfo.path} className="w-8"/>
                        </OutboundLink>
                    ))
                }
            </div>
        );
    }
}
