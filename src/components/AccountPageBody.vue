<script>
import { app, getProfileInfo, setProfileInfo } from "../../api/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { openModal, closeModal, startLoad, endLoad } from "../assets/js/frontendFunctions"
//get componenets
const functions = getFunctions(app);
const auth = getAuth(app);
//define functions
const requestProfileInfo = httpsCallable(functions, "getProfileInfo");
const update = httpsCallable(functions, "updateProfile");
const getUser = httpsCallable(functions, "getUser");
const addFriend = httpsCallable(functions, "addListener");
const removeFriend = httpsCallable(functions, "removeListener");
const getListeningTo = httpsCallable(functions, "getListeningTo");

//connect emulator
// connectFunctionsEmulator(functions, "localhost", 5001);

export default {
  data() {
    return {
      //login information
      email: "",
      password: "",
      loggedIn: false,
      displayAlbums: false,
      displayRecs: false,

      //account information
      accountInfo: {},
      listeningTo: [],

      //search information
      searchedUser: {},
      hasResult: false,
      message: "",
      input: "",
      typing: false,

      //updated profile temp variables
      newBio: "",
      newURL: "",
    }
  },
  created() {
    let listener = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loggedIn = true;
      }
      else {
        this.loggedIn = false;
      }
    });
    listener();
  },
  watch: {
    loggedIn() {
      this.refresh();
    },
    '$route.params': {
      handler() {
        this.refresh();
      }
    },
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
      if (this.$route.params.name && JSON.stringify(getProfileInfo()) == '{}') {
        this.loggedIn = true;
        console.log("Getting Profile From Server");
        //get the profile information of the user once their are signed in
        //stored under the users id
        requestProfileInfo({ field: null }).then((info) => {
          //set the data on the page
          setProfileInfo(info.data);
          this.accountInfo = info.data;

          //get the data of the accounts that the user listens to
          getListeningTo().then((result) => {
            this.listeningTo = result.data;
            console.log(this.listeningTo);
          }).catch((error) => {
            console.log(error);
          });
        }).catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
        //if logged in and there is a valid user and the data has not been retrieved
      }
      else if (this.$route.params.name) {
        this.loggedIn = true;
        this.accountInfo = getProfileInfo();

        //get the data of the accounts that the user listens to
        getListeningTo().then((result) => {
          this.listeningTo = result.data;
          console.log(this.listeningTo);
        }).catch((error) => {
          console.log(error);
        });
      }
      else {
        this.loggedIn = false;
      }
    },

    showAlbums(show) {
      this.displayAlbums = show;
      this.displayRecs = false;
    },

    showRecommendations() {
      console.log(this.accountInfo.recommendedArtists);
      this.displayAlbums = false;
      this.displayRecs = true;
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
      update({ "field": 'bio', "value": this.newBio }).then((res) => {
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
      update({ "field": 'pfpURL', "value": this.newURL }).then((res) => {
        console.log(res.data.body);
        this.accountInfo.pfpURL = this.newURL;
        setProfileInfo(this.accountInfo);
        this.newURL = "";
        endLoad();
      }).catch((error) => {
        console.log(error.code, error.message);
      });
    },

    search(input) {
      if (!this.typing) {
        this.typing = true;
        setTimeout(() => this.sendSearchRequest(input), 150);
      }
    },

    sendSearchRequest(input) {
      this.typing = false;
      if (input.length > 0) {
        getUser({ username: input }).then((result) => {
          if (result.data.code === 1) {
            console.log(result.data.body);
            this.hasResult = false;
            this.searchedUser == {};
            return;
          }
          else if (result.data.code === 0) {
            console.log(result.data.userData);
            this.searchedUser = result.data.userData;
            if (this.accountInfo.listeningTo.find(addedID => addedID == this.searchedUser.id)) {
              this.message = `Already Listening to ${this.searchedUser.username}`;
              this.hasResult = false;
            }
            else {
              this.hasResult = true;
              this.message = "No Such User";
            }
          }
        }).catch((error) => {
          console.log(error);
        });
      }
      else {
        this.message = "";
        this.hasResult = false;
        this.searchedUser = {};
      }
    },

    follow() {
      if (this.hasResult) {
        startLoad(this);
        //ensure the json object has an array to push to
        if (!(this.accountInfo.hasOwnProperty("listeningTo"))) {
          this.accountInfo.listeningTo = [];
        }

        this.hasResult = false;
        this.accountInfo.listeningTo.push(this.searchedUser.id);
        setProfileInfo(this.accountInfo);

        addFriend({ id: this.searchedUser.id }).then((result) => {
          console.log(result);
          this.searchedUser = {};

          getListeningTo().then((ret) => {
            this.listeningTo = ret.data;
            endLoad();
          }).catch((error) => {
            console.log(error);
            endLoad();
          });
        }).catch((error) => {
          console.log(error);
          endLoad();
        })
      }
    },

    unfollow(id) {
      startLoad(this);
      this.accountInfo.listeningTo.splice(this.accountInfo.listeningTo.indexOf(id), 1);
      this.listeningTo = this.accountInfo.listeningTo;
      setProfileInfo(this.accountInfo);

      removeFriend({ id: id }).then((result) => {
        console.log(result.data);

        getListeningTo().then((ret) => {
          this.listeningTo = ret.data;
          endLoad();
        }).catch((error) => {
          console.log(error);
          endLoad();
        });
      }).catch((error) => {
        console.log(error);
        endLoad();
      });
    },

    notAlreadyLiked(id) {
      return !(this.accountInfo.likedArtists.find(artist => artist.id == id));
    },

    viewArtist(id) {
      let newData = [];
      if (this.accountInfo.recommendedArtists.length == 1) {
        this.accountInfo.recommendedArtists = [];
      }
      else {
        newData = this.accountInfo.recommendedArtists.splice(this.accountInfo.recommendedArtists.indexOf(this.accountInfo.recommendedArtists.find(artist => artist.id == id)), 1);
      }

      setProfileInfo(this.accountInfo);
      update({ field: "recommendedArtists", value: newData }).then((result) => {
        console.log(result);
      });
      this.$router.push({ name: 'ArtistPage', params: { aid: id } });
    },

    getOtherPFP(url) {
      return url == "" ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" : url;
    },
  },
  computed: {
    pfpURL() {
      return (JSON.stringify(this.accountInfo) == '{}' || this.accountInfo.pfpURL == "") ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" : this.accountInfo.pfpURL;
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
        <div class="rounded-top text-white cols__container backg">
          <div class="left__col">
            <!-- profile information -->
            <div class="right__col">
              <div class="row">
                <div class="col d-flex flex-row">
                  <div class="pfpBio" style="background-color:transparent;">
                    <div class="pfp">
                      <img v-bind:src="this.pfpURL" alt="Generic placeholder image" class="img-fluid img-thumbnail mt-4 mb-2"
                        style="height: 150px; width: 150px; z-index: 1">
                      <button type="button" class="btn-get-started"
                       
                        @click="openProfileEdit()">
                        Edit
                      </button>
                    </div>
                    <div class="bio">
                      <h2 class="display-5 fw-bold" style="font-size:225%">{{ this.accountInfo.username }}</h2>
                      <p>{{ this.accountInfo.bio }}</p>
                      <h5>Listeners: {{ this.accountInfo.listenerCount }}</h5>
                    </div>
                  </div>

                </div>
                <div class="col">
                  <div class="listeningTo"  >
                    <h4>Listening To:</h4>
                    <div class="listenList">
                      <div v-for="user in this.listeningTo" @click="unfollow(user.id)">
                        <img :src="getOtherPFP(user.pfpURL)" style="height: 50px; width: 50px;" alt="PFP">
                        <h4>{{ user.username }}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <input class="input-search mx-auto" v-model="input" @keyup="search(this.input)"
                    placeholder="Whos recommendations do you want to listen to?" style="max-width: 90%; height:50px;">
                  <div class="search" v-if="hasResult">
                    <div @click="follow">
                      <img :src="getOtherPFP(this.searchedUser.pfp)" style="height: 50px; width: 50px;" alt="PFP">
                      <h4>{{ this.searchedUser.username }}</h4>
                    </div>
                  </div>
                  <div class="mx-auto" v-else>
                    <h4>{{ this.message }}</h4>
                  </div>
                </div>
              </div>
              
            </div>
            <br>
            <!-- sorting albums -->
            <div class="row">
              <div class="col d-flex justify-content-center">
                <nav>
                  <ul >
                    <li class="list" style="text-indent: 20px; cursor: pointer;"><a class="text" @click="showAlbums(true)">Liked Albums</a></li>
    
                    <li class="list" style="text-indent: 20px; cursor: pointer;"><a class="text" @click="showAlbums(false)">Liked Artists</a></li>
    
                    <li class="list" style="text-indent: 20px; cursor: pointer;"><a class="text" @click="showRecommendations">Recommended
                        Artists</a></li>
    
                  </ul>
                  <br>
                </nav>
              </div>
            </div>
            
            <div class="row">
              <div class="col">
                <div class="photos" v-if="this.displayAlbums">
                  <img v-for="album in this.accountInfo.likedAlbums" :src="album.images[0].url" :alt="album.name"
                    @click="this.$router.push({ name: 'ArtistPage', params: { aid: album.artists[0].id } })">
                </div>
                <div class="photos" v-else-if="this.displayRecs">
                  <div v-for="artist in this.accountInfo.recommendedArtists">
                    <img v-if="notAlreadyLiked(artist.id)" :src="artist.images[0].url" :alt="artist.name"
                      @click="viewArtist(artist.id)">
                  </div>
                </div>
                <div class="photos" v-else>
                  <img v-for="artist in this.accountInfo.likedArtists" :src="artist.images[0].url" :alt="artist.name"
                    @click="this.$router.push({ name: 'ArtistPage', params: { aid: artist.id } })">
                </div>
              </div>
            </div>

          </div>
        </div>
        
        
      </div>

      <div class="col-lg-6 mx-auto" style="padding-top:10%; width: 100vw;height: 60vh; background-color:#8C3E3E">
      </div>

    </body>
  </div>

  <div v-else>

    <section class="px-4 py-5 text-center backg">

      <div class="col-lg-6 mx-auto" style="padding-top:10%">
        <h4 class="lead mb-4" style="color:white; ">You are not logged into your account.<br> To login click <h3
            style="display:inline"><strong><a class="here" @click="opensignin()">HERE</a></strong></h3><br> or to create an account click
          <h3 style="display:inline"><strong><a class="here" @click="opensignup()">HERE</a></strong></h3>.
        </h4>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">

        </div>
      </div>
    </section>

  </div>
  <div class="col-lg-6 mx-auto gap" style="padding-top:10%; width: 100vw;height: 60vh;">
  </div>
</template>

<style scoped>
.display-artists {
  display: none;
}

.backg{
  background-image:linear-gradient(to top, #8C3E3E , black);
}
.gap{
  background-color:#8C3E3E;
}

.hero {
  background-color: black;
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
  color: #d9d9d9;
  text-decoration: none;
  border: 2px solid #8C3E3E;
}

.btn-get-started:hover {
  background: #8C3E3E;
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
h4{
  color:#d9d9d9;
  font-family:"IBM Plex Sans Condensed", sans serif;
}

.close:hover,
.close:focus {
  color: #8C3E3E;
  text-decoration: none;
  cursor: pointer;
}

.close1:hover,
.close1:focus {
  color: #8C3E3E;
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
 text-transform: uppercase;
  color: #d9d9d9;
  text-decoration:none;
}

/* scrollbar */
::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-track {
    
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color:#BFB1A4;
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(38,38,38,0); 
}

.listeningTo {
  max-width: 600px;
  margin: 20px
}

.listenList {
  overflow-y: scroll;
  max-height: 190px;
  max-width: 600px;
}

.pfpBio {
  display: flex;
}

.pfp {
  width: 150px;
  margin: 20px;
}


.search {
  max-height: 200px;
  justify-content: center;
}

/* profile picture */
.header__wrapper .cols__container .right__col .img__container {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translatex(-50%);
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
  border: 3.5px solid #BFB1A4;
  background: transparent;
}

.btn-get-started:hover {
  background: #BFB1A4;
  color: #D9D9D9;
}

.header__wrapper .cols__container .right__col .img__container img {
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  box-shadow: 1px 3px 12px rgba(0, 0, 0, .4);
}

/* username */
.header__wrapper .cols__container .right__col h2 {
  margin-top: 60px;
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 5px;
}

/*bio*/
.header__wrapper .cols__container .right__col p {
  font-size: 0.9rem;
  color: #818181;
  margin: 0;
}

/* "Liked albums" color and uppercase */
.header__wrapper .cols__container .left__col nav ul li {
  display:block;
  text-transform: uppercase;
  color:#BFB1A4;
}
ul li a:hover, ul li a:focus {
color:#d9d9d9;
}
.text{
   display:block;
  text-transform: uppercase;
  color: #BFB1A4;
}
.text:hover{
  color:#d9d9d9;
}

.here:hover{
  color: #BFB1A4;
}

img {
  transition: transform .2s;
}

.photos img:hover {
  transform: scale(1.1);
}

/* Friend Search Bar */
.input-search {
  border: 0;
  outline: 0;
  height: 50px;
  width: 100%;
  border-style: none;
  padding: 10px;
  margin: 10px;
  font-size: 18px;
  letter-spacing: 2px;
  outline: none;
  border-radius: 25px;
  transition: all .5s ease-in-out;
  background-color: white;
  padding-right: 40px;
  color: gray;
}

.input-search::placeholder {
  color: rgba(255, 255, 255, .5);
  font-size: 18px;
  letter-spacing: 2px;
  font-weight: 100;
}

.input-search:focus {
  border-radius: 0px;
  background-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, .5);
  transition: all 500ms cubic-bezier(0, 0.110, 0.35, 2);
}


/* album grid layout*/
@media (min-width: 501px) {
  .header__wrapper .cols__container .left__col .photos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }
}

.header__wrapper .cols__container .left__col .photos img {
  max-width: 100%;
  display: block;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 500px) {
  .header__wrapper .cols__container .left__col .photos {

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;

  }

  .header__wrapper .cols__container .right__col .col{
    width: 100%;
  }

}
</style>
