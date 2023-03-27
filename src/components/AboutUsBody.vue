

<!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous" /> -->
<script>
import { app, getProfileInfo, setProfileInfo, isLoggedIn } from "../../api/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { openModal, closeModal, startLoad, endLoad } from "../assets/js/frontendFunctions"

//get componenets
const functions = getFunctions(app);
const auth = getAuth(app);

//define functions
const requestProfileInfo = httpsCallable(functions, "getProfileInfo");
const update = httpsCallable(functions, "updateProfile");

//connect emulator
// connectFunctionsEmulator(functions, "localhost", 5001);

export default {
  data() {
    return {
      //login information
      email: "",
      password: "",
      uid: "",  //this is here instead of the global one because it needs to work from the url
      loggedIn: isLoggedIn(),

      //account information
      accountInfo: {},

      //updated profile temp variables
      newBio: "",
      newURL: "",
    }
  },
  created() {
    this.refresh();
  },
  watch: {
    '$route.params': {
      handler() {
        this.refresh();
      }
    }
  },
  methods: {
    opensignin() {
      openModal(0);
    },

    opensignup() {
      openModal(1);
    },

    openProfileEdit() {
      openModal(2);
    },

    closeProfileEdit() {
      closeModal(2);
    },

    //refresh the data contained on the page
    refresh() {
      this.accountInfo = {};
      //onAuthStateChanged returns a function which unhooks the event listener
      let listener = onAuthStateChanged(auth, (user) => {
        //if there is no user, user.uid will be undefined
        this.uid = user ? user.uid : this.$route.params.uid;

        //if logged in and there is a valid user and the data has not been retrieved
        if (isLoggedIn() && this.uid != undefined && JSON.stringify(getProfileInfo()) == '{}') {
          console.log("Getting Profile From Server");

          //get the profile information of the user once their are signed in
          //stored under the users id
          requestProfileInfo({ "id": this.uid }).then((info) => {
            //set the data on the page
            setProfileInfo(info.data);
            this.accountInfo = info.data;
            console.log(this.accountInfo);
          }).catch((error) => {
            console.log(error.code);
            console.log(error.message);
          });
        }
        else {
          this.accountInfo = getProfileInfo();
        }
      });
      //unhook the listener
      listener();
      this.loggedIn = isLoggedIn();
    },
  }
}
</script>
<template>
  <body style="background-color: black; color:white; padding-top:10%">
<div class="px-4 pt-5 text-center">
    <h1 class="display-4 fw-bold">Change how you discover music with Crate Digger</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4"><strong> <h4 style="display:inline"><a @click="opensignin()">Sign in</a></h4> </strong> or <strong><h4 style="display:inline"><a @click="opensignup()">register</a></h4></strong> to get started. We’re your home for logging your favourite artists and albums. We also recommend you artists based on your favourite artists and albums</p>
    </div>
  </div>

  <div class="container col-xxl-8 px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">

        <img src="../assets/img/CreateAccount.png" class="d-block mx-lg-auto img-fluid" width="300" height="300"
          loading="lazy">
      </div>
      <div class="col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">First create an account</h1>
        <p class="lead">Register an account using your email and chose a suitable email and password.</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
        </div>
      </div>
    </div>
  </div>


  <div class="container col-xxl-8 px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">Search for your favourite the artist</h1>
        <p class="lead">Go to the search page and search for your favourite artists. </p>

      </div>
      <div class="col-lg-6">
        <img src="../assets/img/Search.png" class="d-block mx-lg-auto img-fluid" width="700" height="500" loading="lazy">

        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
        </div>
      </div>
    </div>
  </div>

  <div class="container col-xxl-8 px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">

        <img src="../assets/img/LikingTheBeatles.jpg" class="d-block mx-lg-auto img-fluid" width="300" height="300"
          loading="lazy">
      </div>
      <div class="col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">View their profile</h1>
        <p class="lead">Here you can see what genre of music they make, related artists and unrelated artists. You can
          favourite this artist and scroll through their entire discography and favourite your favourite albums</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
        </div>
      </div>
    </div>
  </div>

  <div class="container col-xxl-8 px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">View your favourite artists</h1>
        <p class="lead">Once you favourite an artist they will be saved to yourn profile page. You can click on the
          artists profile picture to view their profile </p>

      </div>
      <div class="col-lg-6">
        <img src="../assets/img/TheBeatlesAddedToP.jpg" class="d-block mx-lg-auto img-fluid" width="700" height="500"
          loading="lazy">

        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
        </div>
      </div>
    </div>
  </div>

  <div class="container col-xxl-8 px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">

        <img src="../assets/img/LikingAlbums.jpg" class="d-block mx-lg-auto img-fluid" width="300" height="300"
          loading="lazy">
      </div>
      <div class="col-lg-6">
        <h1 class="display-5 fw-bold lh-1 mb-3">Favourite their albums</h1>
        <p class="lead">When scrolling through the artists discography you can favourite their albums</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
        </div>
      </div>
    </div>
  </div>

  <div class="px-4 pt-5 text-center">
    <h1 class="display-4 fw-bold">View your favourite albums</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">Your profile will now display all your favourited artists and albums</p>

    </div>
    <div>
      <div class="container px-5">
        <img src="../assets/img/AlbumsAddedTop.jpg" class="img-fluid rounded-3 shadow-lg mb-4" alt="Example image"
          width="700" height="500" loading="lazy">
      </div>
    </div>
  </div>

  <div class="px-4 pt-5 text-center">
    <h1 class="display-4 fw-bold">Most importantly we reccomend you artists!</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">Go to recommedations and start liking and disliking artists as they appear on the screen</p>

    </div>
    <div>
      <div class="container px-5">
        <img src="https://townsquare.media/site/50/files/2016/09/superlike-2.jpg?w=1200&h=0&zc=1&s=0&a=t&q=89"
          class="img-fluid rounded-3 shadow-lg mb-4" alt="Example image" width="700" height="500" loading="lazy">
      </div>
    </div>
  </div>
</body>
</template>

<style scoped>
.body {
  background-color: black;
}

.hero {
  font-family: "Roboto", sans-serif;
  background-color: black;
  color: white;
  padding-top: 12.5%;
}</style>
