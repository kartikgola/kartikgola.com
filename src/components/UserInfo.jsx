import React, { Component } from "react";
import SocialLinks from "./SocialLinks";

export default class UserInfo extends Component {
    render() {
        const { config } = this.props;
        return (
            <div className="flex flex-col items-center space-y-5">
                <img src={config.siteProfilePicture} className="rounded-full ring-2 ring-white w-60 lg:w-50 shadow shadow-2xl" />
                <span className="text-4xl mt-5">
                    Hi, I'm <span className="font-medium">Kartik Gola</span>.
                </span>
                <SocialLinks config={config}/>
            </div>
        );
    }
}
