import React, { Component } from "react";

class Page404 extends Component {
    render() {
        if (typeof window !== 'undefined') {
            window.location = '/';
        }
        return null;
    }
}


export default Page404;
