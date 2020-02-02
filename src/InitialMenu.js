import React, { Component } from 'react';
import { Button } from 'reactstrap';
//import { useHistory } from 'react-router-dom';
import { Link, animateScroll as scroll } from "react-scroll";

export default class InitialMenu extends Component {
  constructor(props) {
  	super(props);

    this.state = {};
  }

  scrollToTop = () => {
    scroll.scrollToTop();
  };

  render() {
    return (
        <div class="container">
            <div class="row section2">
                <div class="col-lg">
                    <Link             
                        activeClass="active"
                        style={{color: "white"}}
                        to="section1"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="btn btn-primary btn-large btn-block menu-btn">
                            Sign Up
                    </Link>
                </div>
                <div class="col-lg">
                    <Link             
                        activeClass="active"
                        style={{color: "white"}}
                        to="section1"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="btn btn-primary btn-large btn-block menu-btn">
                            Get Mail
                    </Link>
                </div>
            </div>
            <div class="row section1">
                <div class="col-lg">
                    <Link             
                        activeClass="active"
                        style={{color: "white"}}
                        to="section2"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="btn btn-primary btn-large btn-block menu-btn">
                            Scan Mail
                    </Link>
                </div>
                <div class="col-lg">
                    <Link             
                        activeClass="active"
                        style={{color: "white"}}
                        to="section1"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="btn btn-primary btn-large btn-block menu-btn">
                            Load Documents
                    </Link>

                </div>
            </div>
        </div>
    )
    ;
  }
}
