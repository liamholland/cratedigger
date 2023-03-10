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
  <section id="SearchBar" class="SearchPage">

    <h2 class="center">
      <input v-model="input" @keyup="search(this.input)" placeholder="What artist do you want to see?" type="search"
        style="width:50%; height:50px; border">
    </h2><br>

    <ul id="results">
      <li v-for="artist in results">
        <div class="artistResult" @click="this.$router.push({name: 'ArtistPage', params: { aid: artist.id}})">
          <img :src="this.setImage(artist.images)" :alt="artist.name">
          <h1>{{ artist.name }}</h1>
        </div>
      </li>
    </ul>

    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

  </section>
  <section>
  </section>
</template>

<style scoped>
.SearchPage {
  font-family: "Roboto", sans-serif;
  background-color: black;
  color: white;
  padding-top: 12.5%;
}

.center {
  position: relative;
  top: 30%;
  width: 100%;
  text-align: center;
  font-size: 18px;
}

.artistResult {
  display: inline-flex;
  width: 50%;
}

ul {
  list-style-type: none;
  text-align: center;
}

img {
  position: relative;
  padding: 5px;
  height: 250px;
  width: 250px;
}
</style>