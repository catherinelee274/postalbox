import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
//import { useHistory } from 'react-router-dom';
import { Link, animateScroll as scroll } from "react-scroll";
import Profile from './Profile.js';
import CarouselGadget from './CarouselGadget.js'
import Webcam from "react-webcam";
const options = { decrypt: true };
const videoConstraints = {
    width: 224,
    height: 224,
    facingMode: "user"
  };
export default class InitialMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        is_bioauthed: false,
        userIdx: -1,
        items: [],
        showDocuments: false,
        cameraOpened: false
    };
    this.webcam = React.createRef();
    this.setBioauth.bind(this);
    this.setItems.bind(this);
    this.viewDocuments.bind(this);
    this.setCameraOpened = this.setCameraOpened.bind(this);
  }

  setBioauth = (status, userIdx) => {
    this.setState({
        is_bioauthed: status,
        userIdx: userIdx
    });
  };

  setItems = (theItems) => {
    this.setState({
        items: theItems
    })
  }

  setCameraOpened = () => {
      this.setState({
          cameraOpened: true
      })
  }

//   setSubmitState = () => {
//       this.setState({
//           submitState: true
//       })
//   }

  scrollToTop = () => {
    scroll.scrollToTop();
  };

  handleSign = () => {

  };


  getPendingMail(userSession, userIdx){
    userIdx = this.state.userIdx;
    if(userIdx == -1){
      console.log("not logged in")
    }
    else {
        userSession.getFile("nutty.json").then((responseData) => {
            var jsonObject = JSON.parse(responseData);
            return jsonObject[userIdx].boxId;
        });
    }
  
    
  }

  // need function to send our Id to backend 
  // get the box number our mail is in from the hardware side 
  // call getMail(boxId) from hardware side
  // if getMail(boxId) == 0: you have no pending mail
  // else: return boxId

  captureCameraFrame(userSession, userIdx){
      
    this.setCameraOpened();
    
  }

  clickedSubmit(userSession, userIdx){
    var image = this.webcam.current.getScreenshot();

    if(userIdx == -1){
        console.log("not logged in")
      }
      else {

            userSession.getFile("nutty.json").then((responseData) => {
                var jsonObject = JSON.parse(responseData);
                jsonObject[userIdx].documents.push(image);
                userSession.putFile("nutty.json", JSON.stringify(jsonObject), options);
            });
          
      }
  }

  uploadDocuments(userSession, userIdx) {
      console.log("hidsfjlsdkjfklss");
      userIdx = this.state.userIdx;
      console.log("clicked");
      // need the camera thing again 
      if(userIdx == -1){
        console.log("not authenticated");
      }
      else{
        this.captureCameraFrame(userSession,userIdx);
        
      }
  }

// uploadDocuments(){
//     console.log("fuck u");
// }

  viewDocuments(userSession, userIdx){
    // returns mail associated with person's image and name
    userIdx = this.state.userIdx;
    console.log(userIdx);
    if(userIdx == -1){
      console.log("not authen");
    }
    else{
      userSession.getFile("nutty.json").then((responseData) => {
        var jsonObject = JSON.parse(responseData);
        console.log("responseData:",responseData);
        
        this.setState({
            items: jsonObject[userIdx].documents,
            showDocuments: true
        })
      })
    }
  }

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
                        onClick={() => {
                            console.log("waddUp buddy");
                            this.uploadDocuments(this.props.userSession, this.state.userIdx)
                        }}
                        activeClass="active"
                        style={{color: "white"}}
                        to="section1"
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
                        onClick={() => this.viewDocuments(this.props.userSession, this.state.userIdx)}
                        activeClass="active"
                        style={{color: "white"}}
                        to="section1"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className="btn btn-primary btn-large btn-block menu-btn">
                            View Documents
                    </Link>

                </div>
            </div>
            {!this.state.is_bioauthed &&
            <Profile userSession={this.props.userSession}
             handleSignOut={this.props.handleSignOut}
             setBioauth={this.setBioauth}
             setItems={this.setItems}/>
            }
            {this.state.viewDocuments &&
            <CarouselGadget items={this.state.items} />
            }
            
            {this.state.cameraOpened &&
            
            <Webcam ref={this.webcam}
            audio={false}
            height={500} 
            screenshotFormat="image/jpeg"
            width={500} 
            forceScreenshotSourceSize={true}
            videoConstraints={videoConstraints}/>
            }
            {this.state.cameraOpened &&  <button onClick={() => {
                            console.log("waddUp buddy");
                            this.clickedSubmit(this.props.userSession, this.state.userIdx);
                        }}>Submit</button> }
        </div>
    )
    ;
  }
}
