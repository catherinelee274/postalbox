import React, { Component } from 'react';
import {
  Person, handlePendingSignIn,
} from 'blockstack';
import Webcam from "react-webcam";
import { signInputs } from 'blockstack/lib/operations';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const {Storage} = require('@google-cloud/storage');

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous'; // replace this with user.name at some point 
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
    };
    
    this.webcam = React.createRef();
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const videoConstraints = {
      width: 224,
      height: 224,
      facingMode: "user"
    };

    return (
      !userSession.isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        {/* <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
        </div> */}
        {/* <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1> */}
        <h1>Welcome</h1>
        <div>      
          <Webcam ref={this.webcam}
            audio={false}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
          />
        </div>

        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            // onClick={handleSignOut.bind(this)} // CHANGE ON CLICK
            onClick={()=>{
              console.log("hi");
              this.uploadImage();}}
          >
            Sign Up
          </button>

          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={()=>{
              console.log('sign in');
              this.uploadImage(userSession,this.webcam.current.getScreenshot()); //webcam returns base encoded x64 
            } //TODO: send this image to Gaia
            } //CHANGE ON CLICK
            
          >
            Sign In
          </button>
        </p>  
      {/* <button onClick={WebcamCapture.capture}>Capture photo</button> */}
      </div> : null
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }


 uploadImage(userSession,image) { //later has param image and is called in gcloud
    // const storage = new Storage();

    console.log("tried");
    //same image 

    const options = { decrypt: true };

    userSession.putFile("image.txt", image, options)
 .then(() => {
    // message.txt exists now, and has the contents "hello world!".
    console.log("successfully uploaded");
 })

//  userSession.getFile('image.txt', options)
//  .then((file) => {
//    var statuses = file;
//    console.log(file);
//  })
    //store as json -> 

    // this.props.userSession.putFile("test.txt", "helloworld", options);

      // try {
      //     // Makes an authenticated API request.
      //     const results =  storage.getBuckets();
      //     storage.bucket("postalstorage").upload(file, {
      //       gzip:true,
      //       metadata:{
      //         cacheControl: 'public, max-age=31536000',
      //       },
      //     });
      //     console.log("tried2");
      //     // const [buckets] = results;
          
      //   } catch (err) {
      //     console.error('ERROR:', err);
      //   }
  }

  uploadMail() {

  }


}
