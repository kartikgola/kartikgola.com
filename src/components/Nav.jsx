import React, { Component } from "react";
import { Link } from "gatsby";

export default class Nav extends Component {
    render() {
        const { config } = this.props;
        return (
            <nav className="text-xl mt-6 flex space-x-3">
                <Link to="/blog">
                    ✨<span className="hover:underline">blog</span>.
                </Link>
                {/*<Link to="/resume">*/}
                {/*    📄<span className="hover:underline">resume</span>.*/}
                {/*</Link>*/}
            </nav>
        );
    }
}