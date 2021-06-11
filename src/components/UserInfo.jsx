import React, { Component } from "react";
import SocialLinks from "./SocialLinks";
import "./UserInfo.css";
import Nav from "./Nav";

export default class UserInfo extends Component {
    render() {
        const { config } = this.props;
        return (
            <div className="flex flex-col items-center">
                <img src={config.siteProfilePicture} className="rounded-full ring-2 ring-white w-60 lg:w-50 shadow shadow-2xl"  alt="kartik_gola"/>
                <div className="text-3xl mt-5">
                    hi, i'm <span className="glitch text-white" data-text="kartik_gola">kartik_gola</span>.
                    <div className="glow">kartik_gola</div>
                </div>
                <div className="subtitle text-xl text-gray-200">software_engineer. gamer.</div>
                <Nav />
                <SocialLinks config={config}/>
            </div>
        );
    }
}
