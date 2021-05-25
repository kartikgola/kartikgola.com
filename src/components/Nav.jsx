import React, { Component } from "react";
import { Link } from "gatsby";

export default class Nav extends Component {
    render() {
        const { config } = this.props;
        return (
            <nav className="flex flex-wrap lg:space-x-10 justify-center">
                <Link to="/" className="inline-flex">
                    <img src={config.siteLogo} className="w-20" />
                </Link>
                <span className="inline-flex justify-end text-2xl font-medium lg:pt-2 space-x-4 lg:mt-6 sm:mt-4 h-full">
                    <Link className="hover:underline" to="/recent">Recent</Link>
                    <Link className="hover:underline" to="/posts">Posts</Link>
                    <Link className="hover:underline" to="/code">Code</Link>
                    <Link className="hover:underline" to="/random">Random</Link>
                    <Link className="hover:underline" to="/about">About</Link>
                </span>
            </nav>
        );
    }
}