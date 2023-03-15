// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1jgV3p06B4MuBS2LREc5aukZDN40VWe0",
  authDomain: "test-project-3d277.firebaseapp.com",
  projectId: "test-project-3d277",
  storageBucket: "test-project-3d277.appspot.com",
  messagingSenderId: "40543349112",
  appId: "1:40543349112:web:a0e480f14e4459df81c08d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//global variables
let profileInfo = {}; //users profile data
let uid = ""; //users id

let max = 50;

export function getProfileInfo(){
  return profileInfo;
}

export function setProfileInfo(info){
  profileInfo = info;
}

export function getUID(){
  return uid;
}

export function setUID(id){
  uid = id;
}

export function isLoggedIn(){
  return uid != "";
}

//this is local - it is written to the server whenever the rest of the profile info is
export function updateSuggestedArtists(artist){
  //backwards compatability for accounts made before this was saved to the users profile
  if(!profileInfo.hasOwnProperty('suggestedArtists')){
    profileInfo.suggestedArtists = [];
  }
  
  if(suggestedArtists.length == max){
    profileInfo.suggestedArtists.shift();
  }

  profileInfo.suggestedArtists.push(artist);
}

export function recentlySuggested(artist){
  return profileInfo.suggestedArtists.includes(artist);
}