import React, { Component } from "react";

export default class SocialLinks extends Component {
    render() {
        const { config } = this.props;
        const { userLinks } = config;
        return (
            <div className="flex justify-between space-x-5">
                {
                    userLinks.map(linkInfo => (
                        <a key={linkInfo.label} href={linkInfo.url} target="_blank">
                            <img src={linkInfo.path} className="w-8"/>
                        </a>
                    ))
                }
            </div>
        );
    }
}
