
<!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous" /> -->
<script>
import { app, getProfileInfo, setProfileInfo, setUID, isLoggedIn } from "../../api/firebase";
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

    logout() {
      startLoad(this);
      auth.signOut();
      setUID("");
      setProfileInfo({});
      this.loggedIn = isLoggedIn();
      endLoad();
      this.$router.push({ path: '/AccountPage/' });
    },

    updateProfile() {
      startLoad(this);

      //update both
      if (this.newBio.length > 0 && this.newURL.length > 0) {
        this.updateBio();
        this.updatePFP();
      }
      //update bio
      else if (this.newBio.length > 0) {
        this.updateBio();
      }
      //update pfp
      else if (this.newURL.length > 0) {
        this.updatePFP();
      }

      this.closeProfileEdit();
      this.refresh();
    },

    //update bio
    updateBio() {
      update({ "id": this.uid, "field": 'bio', "value": this.newBio }).then((res) => {
        console.log(res.data.body);
        this.accountInfo.bio = this.newBio;
        setProfileInfo(this.accountInfo);
        this.newBio = "";
        endLoad();
      }).catch((error) => {
        console.log(error.code, error.message);
      });
    },

    //update pfp
    updatePFP() {
      update({ "id": this.uid, "field": 'pfpURL', "value": this.newURL }).then((res) => {
        console.log(res.data.body);
        this.accountInfo.pfpURL = this.newURL;
        setProfileInfo(this.accountInfo);
        this.newURL = "";
        endLoad();
      }).catch((error) => {
        console.log(error.code, error.message);
      });
    },
  },
  computed: {
    pfpURL() {
      return this.accountInfo.pfpURL ? this.accountInfo.pfpURL : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    },
  },

}
</script>
<template>
  <div v-if="this.loggedIn">
    <div id="myModal1" class="modal"> <!-- edit profile popup  -->
      <!-- Modal content -->
      <div style="align-items: center" class="modal-content">
        <span class="close" @click="closeProfileEdit()">&times;</span>
        <h1 class="h3 mb-3 fw-normal" style="color:white; font-size:40px">Edit Profile</h1>
        <div class="form-floating">
          <input class="form-control" id="floatingInput" required v-model="newBio">
          <label for="floatingInput">Edit Bio</label>
        </div>
        <br>
        <div class="form-floating">
          <input class="form-control" id="floatingInput" required v-model="newURL">
          <label for="floatingInput">Change Profile Picture</label>
        </div>
        <br>


        <a @click="updateProfile" class="btn-get-started">Submit</a>
        <br>
        <a @click="logout" class="btn-get-started">Sign out</a>
      </div>
    </div>

    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- Font Awesome -->
    </head>

    <body>

      <div class="header__wrapper" style="background-color:black">

        <div class="cols__container" style="background-color:#151515">

          <div class="right__col" style="background-color:#151515">

            <div class="left__col" style="background-color:#151515">

              <div class="card" style="background-color:#151515">

                <div class="rounded-top text-white d-flex flex-row" style="background-color: #151515; height:200px;">
                  <div class="dropdown">

                  </div>
                  <div class="ms-4 mt-5flex-column" style="width: 150px; background-color:#151515">
                    <img v-bind:src="this.pfpURL" alt="Generic placeholder image"
                      class="img-fluid img-thumbnail mt-4 mb-2" style="height: 150px; width: 150px; z-index: 1">
                    <button type="button"
                      style="z-index: 1; background-color:white; border-radius:4px; border:none; width: 150px; "
                      @click="openProfileEdit()">
                      Edit profile
                    </button>

                  </div>
                  <div class="ms-3" style="margin-top: 30px;">

                    <h2 class="display-5 fw-bold" style="font-size:225%">{{ this.accountInfo.username }}</h2>
                    <p>{{ this.accountInfo.bio }}</p>
                  </div>
                </div>
                <br>
                <div class="p-4 text-black" style="text-align:left; background-color:#151515">
                  <nav>
                    <ul>
                      <li><a href="">Liked Albums</a></li>
                    </ul>
                    <br>
                  </nav>
                  <!-- album covers -->
                  <div class="photos">
                      <img v-for="album in this.accountInfo.likedAlbums" :src="album.images[0].url" :alt="album.name">
                  </div>
                </div>
              </div>
            </div>
            <br>
          </div>
        </div>
      </div>
 
  <div class="col-lg-6 mx-auto" style="padding-top:10%; width: 100vw;height: 60vh; background-color:#1a1a1a">
  </div>
 
    </body>
  </div>
  
  <div v-else>

    <section class="px-4 py-5 text-center" style="width: 100vw; height: 100vh; color:white; background-color:black">

    <div class="col-lg-6 mx-auto" style="padding-top:10%">
      <h4 class="lead mb-4" style="color:white; ">You are not logged into your account. To login click <h3 style="display:inline"><strong><a @click="opensignin()">here</a></strong></h3> or to create an account click <h3 style="display:inline"><strong><a @click="opensignup()">here</a></strong></h3></h4><div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        
      </div>
    </div>
  </section>

  </div>
</template>

<style scoped>
.hero{
  background-color:black;
  text-align: center;
}
/* The Modal for edit profile (background) */
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
  width: 350px;
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
}

body {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
}

/* liked albums */
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

a {
  text-decoration: none;
}




/* profile picture */
.header__wrapper .cols__container .left__col .img__container {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translatex(-50%);
}

.header__wrapper .cols__container .left__col .img__container img {
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  box-shadow: 1px 3px 12px rgba(0, 0, 0, .4);
}

/* username */
.header__wrapper .cols__container .left__col h2 {
  margin-top: 60px;
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 5px;
}

/*bio*/
.header__wrapper .cols__container .left__col p {
  font-size: 0.9rem;
  color: #818181;
  margin: 0;
}



/* "Liked albums" color and uppercase */
.header__wrapper .cols__container .right__col nav ul li a {
  text-transform: uppercase;
  color: #818181;
}

/* album grid layout*/
.header__wrapper .cols__container .right__col .photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 20px;
}

.header__wrapper .cols__container .right__col .photos img {
  max-width: 100%;
  display: block;
  height: 100%;
  object-fit: cover;
}





@media (min-width: 1017px) {
  .header__wrapper .cols__container .left__col {
    margin: 0;
    margin-right: auto;
  }

  .header__wrapper .cols__container .right__col nav {
    flex-direction: row;
  }
}
</style>

