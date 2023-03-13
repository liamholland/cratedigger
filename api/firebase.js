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
let suggestedArtists = []; //the artist pages the user has viewed in the last [max] page changes

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

export function updateSuggestedArtists(artist){
  if(suggestedArtists.length == max){
    suggestedArtists.shift();
  }

  suggestedArtists.push(artist);
}

export function recentlySuggested(artist){
  return suggestedArtists.includes(artist);
}