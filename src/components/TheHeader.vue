<script>
import { app, setProfileInfo, getProfileInfo } from "../../api/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { openModal, closeModal, startLoad, endLoad } from "../assets/js/frontendFunctions"

//get components
const auth = getAuth(app);
const functions = getFunctions(app);

//define the functions
const checkUname = httpsCallable(functions, "checkUniqueUsername");
const getEmail = httpsCallable(functions, "getEmail");
const register = httpsCallable(functions, "registerAccount");
const getUsername = httpsCallable(functions, "getProfileInfo");

//TODO: remove emulator line when deploying
// connectFunctionsEmulator(functions, "localhost", 5001);

export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      loadingBar: "",
      loggedIn: false,

      //error messages
      errorMessage1: "",
      errorMessage2: "",
      errorMessage3: "",
      errorMessage4: "",
      errorMessage5: "",
      errorMessage6: "",
    }
  },
  created() {
    
    //get the login status
    let listener = onAuthStateChanged(auth, (user) => {
      if(user){   //if the user is logged in
        if(this.username){  //if there is a saved username on the component continue on
          this.loggedIn = true;
        }
        else if(getProfileInfo().username){   //if there is a saved username in the app set it and move on
          this.username = getProfileInfo().username;
          this.loggedIn = true;
        }
        else{   //otherwise get a username from the server which can be used to route to the account page and get the information
          //usually invoked after a hard refresh
          getUsername({field: "username"}).then((res) => {
            this.username = res.data;
            this.loggedIn = true;
          }).catch((error) => {
            console.log(error);
          });
        }
      }
      else{
        this.loggedIn = false;
      }
    });

    //unhook the listener
    listener();
  },
  methods: {

    opensignin() {
      openModal(0);
    },

    closesignin() {
      closeModal(0);
    },

    opensignup() {
      openModal(1);
    },

    closesignup() {
      closeModal(1);
    },

    isEmail(e) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e);
    },

    //get the email if the email is a username
    //otherwise just calls login
    //necessary to allow the promise to resolve from getEmail before trying to sign in to firebase
    beforeLogin() {
      startLoad(this);

      //regex test
      if (!this.isEmail(this.email)) {
        console.log("Not Email; Getting ID from Username");

        if(this.email.length > 0){
          getEmail({ username: this.email }).then((res) => {
            console.log(res.data.body);
            switch (res.data.code) {
              case 0:
                this.username = this.email;
                this.email = res.data.body;
                this.login();
                break;
              case 1:
                this.errorMessage1 = "Email or username does not exist";
                console.log("User Does Not Exist");
                endLoad();
                break;
              default:
                console.log("Unknown Code Returned From Server");
                endLoad();
                break;
            }
          });
        }
        else {
          this.errorMessage1 = "Enter a username or password";
          endLoad();
        }
      }
      else {
        this.login();
      }
    },

    //login function
    login() {

      //sign in with firebase auth using email and password
      signInWithEmailAndPassword(auth, this.email, this.password).then((userCred) => {
        this.closesignin(0); //close the sign in popup
        this.loggedIn = true;
        if(!(getProfileInfo().username)){
          getUsername({field: "username"}).then((res) => {
            this.username = res.data;
            this.loggedIn = true;
            this.routeToAccount();
            endLoad();
          }).catch((error) => {
            console.log(error);
          });
        }
        else{
          this.routeToAccount();
          endLoad();
        }

      }).catch((error) => {
        //handle the firebase errors
        switch (error.code) {
          case "auth/wrong-password":
            this.errorMessage2 = "Incorrect Password"
            console.log("Incorrect Password");
            break;
          case "auth/user-not-found":
            console.log("Incorrect Username or Email");
            break;
          case "auth/missing-email":
            console.log("Please Enter Your Username or Email");
            break;
          default:
            console.log(error.code);
            console.log(error.message);
            break;
        }
        endLoad();
        this.loggedIn = false;
      });

    },

    //register an account
    //calls login after successful execution
    register() {
      startLoad(this);

      //dont run if the email is invalid
      if (!this.isEmail(this.email)) {
        this.errorMessage3 = "invalid email"
        console.log("invalid email");
        endLoad();
        return;
      }

      if (this.username == "") {
        this.errorMessage4 = "Enter a username"
        console.log("Enter a Username");
        endLoad();
        return;
      }

      //check if the username is taken
      checkUname({ "username": this.username }).then((res) => {
        if (res.data.isTaken) {
          console.log(res.data.message);
          return;
        }
        else {
          console.log(res.data.message);
        }
        //create a user in firebaser
        createUserWithEmailAndPassword(auth, this.email, this.password).then((userCred) => {
          const user = userCred.user;

          //register function sets up the database for this users data
          register({"username": this.username, "email": this.email }).then((res) => {
            console.log(res.data);
            this.closesignup();  //close the register popup
            this.login(); //log the user in
          });
        }).catch((error) => {
          //handle firebase errors
          if (error.code == "auth/email-already-in-use") {
            this.errorMessage5 = "Email taken"
            console.log("Email Taken");
          }
          else if (error.code == "auth/weak-password") {
            this.errorMessage6 = "Weak Password";
            console.log("Weak Password");
          }
          else {
            console.log(error.code);
            console.log(error.message);
          }
        });
      }).catch((error) => {
        console.log(error);
        endLoad();
      });
    },

    routeToAccount() {
      if (this.loggedIn) {
        this.$router.push({ name: 'AccountPage', params: { name: (this.username ? this.username :  getProfileInfo().username) } });
      }
      else {
        this.$router.push({ path: '/Account/' });
      }
    },

    logout() {
      startLoad(this);
      auth.signOut();
      setProfileInfo({});
      this.loggedIn = false;
      endLoad();
      this.routeToAccount();
    }
  },

}
</script>

<template>
  <div id="myModal" class="modal"> <!-- Sign in popup  -->
      <!-- Modal content -->
      <div style="align-items: center" class="modal-content">
        <span class="close" @click="closesignin()">&times;</span>
        <p style="font-size: 40px; color: white">Sign in</p>
  
        <p style="color:red">{{errorMessage1}}</p>
        <div class="form-floating">
            <input class="form-control" id="floatingInput" required v-model="email">
            <label for="floatingInput">Email or Username</label>
          </div>
    
        <p style="color:red">{{errorMessage2}}</p>
        <div class="form-floating">
            <input class="form-control" id="floatingInput" type="password" required v-model="password">
            <label for="floatingInput">Password</label>
          </div>
  <br>
        <a @click="beforeLogin()" class="btn-get-started">Sign in</a>
      </div>
    </div>
  
    <div id="myModal1" class="modal"> <!-- create account popup  -->
      <!-- Modal content -->
      <div style="align-items: center" class="modal-content">
        <span class="close" @click="closesignup()">&times;</span>
        <p style="font-size: 40px; text-align: center; color: white">Create account</p>
  
        <p style="color:red">{{errorMessage3}}{{errorMessage5}}</p>
        <div class="form-floating">
            <input class="form-control" id="floatingInput" required v-model="email">
            <label for="floatingInput">Email</label>
          </div>
        
        <p style="color:red">{{errorMessage4}}</p>
        <div class="form-floating">
            <input class="form-control" id="floatingInput" required v-model="username">
            <label for="floatingInput">Username</label>
          </div>
  
      <p style="color:red">{{errorMessage6}}</p>
        <div class="form-floating">
            <input class="form-control" id="floatingInput" type="password" required v-model="password">
            <label for="floatingInput">Password</label>
          </div>
          <br>
        <a @click="register" class="btn-get-started">Create</a>
      </div>
    </div>
  
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <meta charset="utf-8">
    <nav class="navbar navbar-expand-lg " aria-label="Offcanvas navbar large" style="background-color:black">
      <div class="container-fluid" >
         <router-link to="/">
          
          <img style= "object-fit: contain" src="../assets/img/updated_cratedigger_banner.png" alt="Crate Digger" width="120" height="60"><!--Logo-->
        </router-link>
  
        <button style="background-color: grey" class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarsExample03" aria-controls="navbarsExample03" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <div class="collapse navbar-collapse" id="navbarsExample03">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">

        
          <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Condensed" rel="stylesheet">

            <li class="nav-item" style="margin-right: 10px;">
            <router-link to="/">Home</router-link>
            </li>
            <li v-if="!this.loggedIn" class="nav-item" style="list-style-type: none; margin-right: 10px"><a
                 class="myBtn1" id="myBtn1" @click="opensignup()">Sign Up</a></li>
            <li v-if="!this.loggedIn" class="nav-item" style="list-style-type: none; margin-right: 10px;"><a class="myBtn"
                id="myBtn" @click="opensignin()">Login</a></li>
            <li v-if="this.loggedIn" class="nav-item" style="list-style-type: none; margin-right: 10px;" ><a class="myBtn"
                id="myBtn" @click="logout()">Log Out</a></li>
            <li class="nav-item " style=" margin-right: 10px;">
              <router-link to="/AboutUs">About Us</router-link>
            </li>
            <li class="nav-item" style=" margin-right: 10px;">
              <router-link to="/New">What's New?</router-link>
            </li>
            <li class="nav-item" style=" margin-right: 10px;">
              <router-link to="/Search">Search</router-link>
            </li>
  
            <li class="nav-item" style=" margin-right: 10px;" @click="routeToAccount">
              <router-link to="">Account</router-link>
            </li>
  
          </ul>
  
        </div>
      </div>
    </nav>
    
  </template>
  <style scoped>
  .nav-item {
    color: rebeccapurple;
  }
  .myBtn1 {
    list-style-type: none;
  }
  .header {
    z-index: 997;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: black;
    list-style-type: none;
  }
  .navbar {
    padding: 20px 0;
  }
  .navbar a,
  .navbar a:focus {
    display: flex;
    padding: 0 3px;
    font-family: "Roboto", sans-serif;
    font-size: 20px;
    font-weight: 500;
    text-decoration: none;
    color: #1DB954;
    text-transform: uppercase;
    transition: 0.3s;
  }
  .navbar a:hover {
    color: white;
  }
  .hero {
    background-color: black;
    padding-top: 12.5%;
  }
  .btn-get-started {
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 1px;
    display: inline-block;
    padding: 12px 40px;
    border-radius: 50px;
    transition: 0.5s;
    margin: 10px;
    color: white;
    text-decoration: none;
    border: 2px solid #1DB954;
  }
  .btn-get-started:hover {
    background: #1DB954;
    color: black
  }
  .heading:hover {
    color: #1DB954;
  }
  .services {
    color: white;
    background-color: black;
    background-size: cover;
    font-size: 14px;
    padding: 80px 0 60px 0;
    position: relative;
  }
  .section-header {
    padding-bottom: 7.5%;
    color: white;
  }
  .service-item {
    background-color: #262626;
  }
  .service-item:hover {
    color: #1DB954;
  }
  /* The Modal (background) */
  .modal {
    display: none;
    /* Hidden by default */
    position: fixed;
    /* Stay in place */
    z-index: 1;
    /* Sit on top */
    padding-top: 10px;
    /* Location of the box */
    left: 0;
    top: 0;
    /*width: 100%; /* Full width */
    /*height: 100%; /* Full height */
    overflow: auto;
    /* Enable scroll if needed */
    /* background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.6);
    /* Black w/ opacity */
  }
  /* Modal Content */
  .modal-content {
    align-items: left;
    width: 325px;
    height: 500px;
    background-color: #1a1a1a;
    margin: auto;
    padding: 5px;
  }
  /* The Close Button */
  .close {
    position: relative;
    left: 40%;
    color: white;
    float: right;
    font-size: 32px;
    font-weight: bold;
  }
  .close:hover,
  .close:focus {
    color: #1DB954;
    text-decoration: none;
    cursor: pointer;
  }
  .close1:hover,
  .close1:focus {
    color: #1DB954;
    text-decoration: none;
    cursor: pointer;
  }
  /* .modal-content {
  align-items: center;
  width: 350px;
  height: 450px;
  background-color: #1a1a1a;
  margin: auto;
  padding: 10px;
  } */
  </style>
  