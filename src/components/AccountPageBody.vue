
<!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous" /> -->
<script>
import app from "../../api/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

export default {
  data() {
    return {
      //login information
      email: "",
      username: "",
      password: "",
      uid: "",
      isLoggedIn: false,

      //account information
      name: "",
      bio: "",
      pfp: "",
      likedAlbums: [],
      likedArtists: [],

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
    //refresh the data contained on the page
    refresh() {
      console.log(this.uid);

      //get comonenets
      const auth = getAuth(app);
      const functions = getFunctions(app);

      //onAuthStateChanged returns a function which unhooks the event listener
      let listener = onAuthStateChanged(auth, (user) => {
        //if there is no user, user.uid will be undefined
        this.uid = user ? user.uid : this.$route.params.uid;
        this.isLoggedIn = user ? true : false;

        //if logged in and there is a valid user
        if (this.isLoggedIn && this.uid != undefined) {
          console.log(this.uid);
          connectFunctionsEmulator(functions, "localhost", 5001);
          //define functions
          const getProfileInfo = httpsCallable(functions, "getProfileInfo");
          //get the profile information of the user once their are signed in
          //stored under the users id
          getProfileInfo({ "id": this.uid }).then((info) => {
            console.log(info.data);
            //set the data on the page
            this.name = info.data.username;
            this.bio = info.data.bio;
            this.pfp = info.data.pfpURL;
            this.likedAlbums = info.data.likedAlbums;
            this.likedArtists = info.data.likedArtists;
          }).catch((error) => {
            console.log(error.code);
            console.log(error.message);
          });
        }
      });
      //unhook the listener
      listener();
    },
    closesignin(i) {
      let elms = document.querySelectorAll('.modal');
      elms[i].style.display = "none";
    },
    opensignin(i) {
      let elms = document.querySelectorAll('.modal');
      elms[i].style.display = "flex";
    },
    logout() {
      const auth = getAuth(app);
      auth.signOut();
      this.uid = "";
      this.isLoggedIn = false;
    },
    updateProfile() {

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

      this.closesignin(2);
    },
    //update bio
    updateBio() {
      const functions = getFunctions(app);
      connectFunctionsEmulator(functions, "localhost", 5001);

      //define function
      const update = httpsCallable(functions, "updateProfile");

      console.log(this.uid);
      update({ "id": this.uid, "field": 'bio', "value": this.newBio }).then((res) => {
        console.log(res.data.body);
        this.newBio = "";
        this.refresh();
      }).catch((error) => {
        console.log(error.code, error.message);
      });
    },
    //update pfp
    updatePFP() {
      const functions = getFunctions(app);
      connectFunctionsEmulator(functions, "localhost", 5001);

      //define function
      const update = httpsCallable(functions, "updateProfile");
      console.log(this.uid);
      update({ "id": this.uid, "field": 'pfpURL', "value": this.newURL }).then((res) => {
        console.log(res.data.body);
        this.newURL = "";
        this.refresh();
      }).catch((error) => {
        console.log(error.code, error.message);
      });
    }
  },
  computed: {
    pfpURL() {
      return this.pfp == "" ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" : this.pfp;
    }
  },

}
</script>
<template>
  <div v-if="this.isLoggedIn">
    <div id="myModal1" class="modal"> <!-- edit profile popup  -->
      <!-- Modal content -->
      <div style="align-items: center" class="modal-content">
        <span class="close" @click="closesignin(2)">&times;</span>
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
                      class="img-fluid img-thumbnail mt-4 mb-2" style="width: 150px; z-index: 1">
                    <button type="button"
                      style="z-index: 1; background-color:white; border-radius:4px; border:none; width: 150px; "
                      @click="opensignin(2)">
                      Edit profile
                    </button>

                  </div>
                  <div class="ms-3" style="margin-top: 30px;">
                    <h2 style="text-align:left; font-size:50px">{{ this.name }}</h2>
                    <p>{{ this.bio }}</p>
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
                    <img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg"
                      alt="Photo" />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" />
                    <img
                      src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" />
                    <img
                      src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg"
                      alt="Photo" />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" />
                    <img
                      src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" />
                    <img
                      src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/6/6d/Dire_Straits_-_Alchemy_Dire_Straits_Live.jpg"
                      alt="Photo" />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Random_Access_Memories.jpg/220px-Random_Access_Memories.jpg" />
                    <img
                      src="https://mixdownmag.com.au/wp-content/uploads/2020/11/mixdown-magazine-kanye-west-mbdtf.jpg" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg" />
                    <img
                      src="https://americansongwriter.com/wp-content/uploads/2022/07/Kanye-West-album-cover-kids-see-ghosts.jpg" />

                  </div>
                </div>
              </div>
            </div>
            <br>
          </div>
        </div>
      </div>
    </body>
  </div>
  <div v-else>
    <a @click="opensignin(0)" class="btn-get-started" style="color: black;">Log In</a>
    <a @click="opensignin(1)" class="btn-get-started" style="color: black;">Create</a>
  </div>
</template>

<style scoped>
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
