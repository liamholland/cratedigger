<script>
import { app, updateSuggestedArtists, recentlySuggested } from "../../api/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

//get componenets
const functions = getFunctions(app);

//define functions
const getToken = httpsCallable(functions, "getSpotifyToken");
const getArtist = httpsCallable(functions, "getArtist");
const getAlbums = httpsCallable(functions, "getAlbums");
const getRelated = httpsCallable(functions, "getRelatedArtists");
const getUnrelated = httpsCallable(functions, "getUnrelatedArtists");

//TODO: remove emulator connection on prod
connectFunctionsEmulator(functions, "localhost", 5001);

export default {
    data() {
        return {
            //spotify search artists
            artistName: "",
            genres: "",
            albums: [],
            mostRelated: "",
            leastRelated: "",
            lastSuggestedGenre: "",
        }
    },
    created() {
        this.refresh(this.$route.params.aid);
    },
    methods: {
        //refreshes the data on the page
        refresh(artistID) {
            //get a new token for spotify requests
            getToken().then((res) => {
                //get the artist
                getArtist({ token: res.data.access_token, id: artistID }).then((artist) => {
                    this.artistName = artist.data.name;
                    this.genres = ""; //reset the genre
                    artist.data.genres.forEach(genre => {
                        this.genres += genre + '   ';
                    });

                    //get artist albums
                    getAlbums({ token: res.data.access_token, id: artistID }).then((albums) => {
                        this.albums = albums.data.items.sort(this.compareDates);

                        //get the most related artist to this artist
                        getRelated({ token: res.data.access_token, id: artistID }).then((relatedArtist) => {
                            let i = 0;
                            //while the most related was recently suggested to the user
                            do {
                                this.mostRelated = relatedArtist.data.artists[i];
                                i++;
                                if(i == 20){
                                    this.refresh(relatedArtist.data.artists[19].id);
                                    return;
                                }
                            } while(recentlySuggested(this.mostRelated.id))

                            //get artists different to the current artist
                            getUnrelated({ token: res.data.access_token, limit: 20, genres: artist.data.genres, backup: this.lastSuggestedGenre }).then((unrelatedArtist) => {                            
                                console.log(unrelatedArtist.data);
                                
                                this.lastSuggestedGenre = unrelatedArtist.data.genre;
                                
                                let i = 0;
                                do {
                                    this.leastRelated = unrelatedArtist.data.artists[i];
                                    i++;
                                } while(recentlySuggested(this.leastRelated.id));
                            }).catch((error) => {
                                console.log(error);
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                        

                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error);
                });

            }).catch((error) => {
                console.log(error);
            });
        },

        //checks if an album is repeated in an array
        isRepeat(album) {
            let index = this.albums.indexOf(album);
            //dont test the previous to the first index
            if (index == 0) {
                return false;
            }
            else if (index != -1) {
                let prevAlbum = this.albums[index - 1]; //the previous album in the array
                //if the album names are the same
                if (album.name == prevAlbum.name) {
                    return true;
                }
                return false;
            }
        },

        compareDates(d1, d2) {
            let date1 = new Date(d1.release_date);
            let date2 = new Date(d2.release_date);

            if (date1 < date2) {
                return -1;
            }
            else if (date1 > date2) {
                return 1;
            }
            else {
                return 0;
            }
        },

        goToNewArtist(id) {
            updateSuggestedArtists(id);
            this.$router.push({ name: "ArtistPage", params: { aid: id } });
            this.refresh(id);
        }
    },
}
</script>

<template class="body">
    <section class="body">
        <br>
        <p class="artistName">{{ this.artistName }}</p>
        <p class="artistGenre">{{ this.genres }}</p>
        <button class="btn-get-started" @click="goToNewArtist(this.mostRelated.id)">Related Artist: {{ this.mostRelated.name }}</button>
        <button class="btn-get-started" @click="goToNewArtist(this.leastRelated.id)">Unrelated Artist: {{ this.leastRelated.name }}</button>
        <br><br><br><br>

        <ul style="background-color:black">
            <li v-for="album in this.albums">
                <div v-if="!this.isRepeat(album)" class="albumResult">
                    <img :src="album.images[0].url" alt="Album Cover">
                    <div class="albumInfo">
                        <button type="button" class="btn btn-outline-danger" style="position:absolute; left: 72.5%">

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-heart-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                            </svg></button>


                        <h1> {{ album.name }} </h1>



                        <h3>{{ album.release_date }}</h3>


                    </div>

                </div>
            </li>

        </ul>

    </section>
</template>
  
<style scoped>
.albumResult {
    background-color: #151515;
    text-align: left;
}

.albumInfo {
    color: whitesmoke;
}

.artistName {
    color: white;
}

.body {
    background-color: black;
    text-align: center;
}

.btn-get-started {
    background-color: black;
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

.artistName {
    font-size: 100px;
    text-align: center;
}

.artistGenre {
    color: white;
    font-size: 20px;
    text-align: center;
}

.albumResult {
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
}</style>
