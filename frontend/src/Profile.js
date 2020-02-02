import React, { Component } from 'react';
import {
  Person, handlePendingSignIn, ecPairToHexString,
} from 'blockstack';
import { signInputs } from 'blockstack/lib/operations';

import Webcam from "react-webcam";
import { create, all } from 'mathjs';

const config = { };
const math = create(all, config);

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

var currentId = 0; 
const options = { decrypt: true };

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
      value:''
    };
    
    this.webcam = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  

  handleChange(event) {
    console.log(event.target.value);
    // this.setState({value: event.target.value});
    this.setState({value: event.target.value});

  }

  handleSubmit(event) {
    // console.log(this.state.value);
    return this.event.value;
    event.preventDefault();
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
            height={500} 
            screenshotFormat="image/jpeg"
            width={500} 
            forceScreenshotSourceSize={true}
            videoConstraints={videoConstraints}
          />
        </div>

      <form onSubmit={this.handleSubmit}>
        <label>
          Full Name:
          <input type="text" name={this.state.value} onChange={this.handleChange} />
        </label>
      </form>

        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signup-button"
            // onClick={handleSignOut.bind(this)} // CHANGE ON CLICK
            onClick={()=>{
              console.log(this.state.value);
              this.signUp(userSession,this.webcam.current.getScreenshot(),this.state.value);
            }}
          >
            Sign Up
          </button>

          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={()=>{
              console.log('sign in');
              this.signIn(userSession,this.webcam.current.getScreenshot(),this.state.value); //webcam returns base encoded x64 
            }} 
            
          >
            Sign In
          </button>
        </p>  
      </div> : null
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }


 signUp(userSession,image,name) {
   //set up 

    this.clear(userSession).then(()=>{
      console.log("cleared");
      currentId = 0;
      return userSession.getFile("nutty.json")
    })

    .then((responseData) => {
      console.log("responseData:",responseData);
      // var jsonObject = JSON.parse(json);
      var jsonObject = JSON.parse(responseData);
      jsonObject.push({
        fullName: name, 
        poBox: currentId,
        documents: [],
        image: image // **TODO*** 
      });
      userSession.putFile("nutty.json",JSON.stringify(jsonObject),options).then(()=>{
        console.log("added new user with po box of id ", currentId);
        currentId = currentId+1;
      })
    })
  }

  clear(userSession){ //clears 'database'
    const options = { decrypt: true };
    var ex = [];
    var result = JSON.stringify(ex);
    return userSession.putFile("nutty.json", result, options)
  }

  signIn(userSession,image, name){
    // get using name
    var max = 0;
    var maxUserId = 0;
    var json = userSession.getFile("nutty.json").then((responseData) => {
      // console.log("responseData:",responseData);
      // var jsonObject = JSON.parse(json);
      var jsonObject = JSON.parse(responseData);
      // jsonObject.name
      // console.log("hi");
      for(var user of jsonObject){
        if(name.toUpperCase() == user.fullName.toUpperCase()){
          //find matching image
          var userEmbedding = fetch('http://3.234.82.13:4000/get-embedding', {
                  method: 'POST',
                  mode: 'cors',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                  },
                  body: JSON.stringify({image: image})
                }).then((res) => {
                  console.log(res);
                  return res.json();
                })
                .then((data) =>  {
                  console.log(data);
                  return data;
                })
              .catch((err)=>console.log(err));
          
          var currEmbedding = fetch('http://3.234.82.13:4000/get-embedding', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({image: user.image})
            }).then((res) => {
              console.log(res);
              return res.json();
            })
            .then((data) =>  {
              console.log(data);
              return data;
            })
            .catch((err)=>console.log(err));

            let promises = [userEmbedding, currEmbedding];
            Promise.all(promises).then((embeddings) => {
              let userEmb = embeddings[0].embedding;
              let currEmb = embeddings[1].embedding;
              console.log(userEmb, currEmb);
            
              var dotProduct = math.dot(currEmb, userEmb);
              var currNorm = math.sqrt(math.dot(currEmb, currEmb));
              var userNorm = math.sqrt(math.dot(userEmb, userEmb));
              let cosineSimilarity = dotProduct / currNorm / userNorm;
              if(cosineSimilarity > max && cosineSimilarity > 0.5){
                max = cosineSimilarity;
                maxUserId = user.boxId;
              }
              console.log(cosineSimilarity);
            })

        }
      }
    });
    // console.log(max);
    //then get data for all that shit
    //return id but at some point change that to id (future)
    return maxUserId; 
  }

  getPendingMail(userSession, boxId){
    //get the text of nutty.txt 
    //set the PO box to current id in json
    // set the 

    //get the ID
    // var id = this.signIn(userSession, image, name); 
    

    // userSession.getFile("nutty.json").then(() => {
    //   var jsonObject = JSON.parse(responseData);
    //   jsonObject.push([{
    //     fullName: name, 
    //     image: image, // **TODO*** 
    //     poBox: currentId,
    //     documents: []
    //   }]);
    // })
    
  }

  // need function to send our Id to backend 
  // get the box number our mail is in from the hardware side 
  // call getMail(boxId) from hardware side
  // if getMail(boxId) == 0: you have no pending mail
  // else: return boxId

  uploadMail() {

  }

  viewMail(){
    // returns mail associated with person's image and name
  }


}
