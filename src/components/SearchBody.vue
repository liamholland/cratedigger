<script>
import { app } from "../../api/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

//get componenets
const functions = getFunctions(app);
//define functions
const searchArtist = httpsCallable(functions, "searchArtist");

//TODO: remove emulator connection on prod
// connectFunctionsEmulator(functions, "localhost", 5001);

export default {
  data() {
    return {
      //spotify search artists
      token: "",
      input: "",
      results: [],
      typing: false,
    }
  },
  created() {
    //get a new token for spotify requests

    //define function
    const getToken = httpsCallable(functions, "getSpotifyToken");

    //send request
    getToken().then((res) => {
      this.token = res.data.access_token;
      console.log(this.token);
    }).catch((error) => {
      console.log(error);
    });
  },
  methods: {
    //search for artists on spotify given a search term
    search(term) {
      if(!this.typing){
        this.typing = true;
        setTimeout(() => this.sendSearchRequest(term), 400);
      }
    },
    
    sendSearchRequest(term){
      this.typing = false;
      if (term.length > 0) {
        //send request (will return limit number of results)
        searchArtist({ token: this.token, term: term, limit: 10 }).then((res) => {
          this.results = res.data.artists.items;  //an array of results
        }).catch((error) => {
          console.log(error);
        });
      }
      else {
        this.results = [];
      }
    },

    //return the image to use for the artist given an array of their images
    setImage(images) {
      return images.length > 0 ? images[0].url : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    },
  },
}
</script>

<template>
  <section class="py-5 text-center backg" style="color:white">


    <div class="col-lg-6 mx-auto" style="padding-top:10%;">
      <input class="input-search" v-model="input" @keyup="search(this.input)"
        placeholder="What artist do you want to see?" style="width:75%; height:50px;">
    </div>
    <div class="container">
      <ul id="results" style="padding-top:25px;">
        <li v-for="artist in results">
          <div class="photos" @click="this.$router.push({ name: 'ArtistPage', params: { aid: artist.id } })">
            <img :src="this.setImage(artist.images)" :alt="artist.name">
            <h1 style="font-size:30px; color:white">{{ artist.name }}</h1>
            <br>

          </div>
        </li>
      </ul>
    </div>
  </section>
  <div class="col-lg-6 mx-auto gap" style="padding-top:10%; width: 100vw;height: 60vh;">
  </div>
</template>
  
<style scoped>
* {
  box-sizing: border-box;
}

body {
  margin: 0px;
  padding: 0px;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.search-box {
  width: fit-content;
  height: fit-content;
  position: relative;
}

.input-search {
  border: 0;
  outline: 0;
  height: 50px;
  width: 50px;
  border-style: none;
  padding: 10px;
  font-size: 18px;
  letter-spacing: 2px;
  outline: none;
  border-radius: 25px;
  transition: all .5s ease-in-out;
  background-color: white;
  padding-right: 40px;
  color: grey;
}

.backg{
  background-color:#0d0d0d

}
.gap{
  background-image:linear-gradient(to bottom, #0d0d0d , #8C3E3E 90%);
}

.input-search::placeholder {
  color: rgba(255, 255, 255, .5);
  font-size: 18px;
  letter-spacing: 2px;
  font-weight: 100;
}

.input-search:focus {
  width: 300px;
  border-radius: 0px;
  background-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, .5);
  transition: all 500ms cubic-bezier(0, 0.110, 0.35, 2);
}

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

.SearchPage {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  
  color: white;
}

ul {
  list-style-type: none;
  text-align: center;
}

img {
  position: relative;
  height: 180px;
  width: 180px;
}
img:hover {
  transform: scale(1.05);
  transition: 0.5s;
}
</style>