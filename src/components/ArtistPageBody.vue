<script>
import { app } from "../../api/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

//get componenets
const functions = getFunctions(app);

//define functions
const getToken = httpsCallable(functions, "getSpotifyToken");
const getArtist = httpsCallable(functions, "getArtist");
const getAlbums = httpsCallable(functions, "getAlbums");
const getRelated = httpsCallable(functions, "getRelatedArtists");

//TODO: remove emulator connection on prod
// connectFunctionsEmulator(functions, "localhost", 5001);

export default {
    data() {
        return {
            //spotify search artists
            artistName: "",
            albums: [],
            mostRelated: "",
        }
    },
    created() {
        this.refresh();
    },
    methods: {
        //refreshes the data on the page
        refresh() {
            //get a new token for spotify requests
            getToken().then((res) => {
                //get the artist
                getArtist({ token: res.data.access_token, id: this.$route.params.aid }).then((artist) => {
                    this.artistName = artist.data.name;

                    //get artist albums
                    getAlbums({ token: res.data.access_token, id: this.$route.params.aid }).then((albums) => {
                        this.albums = albums.data.items.sort(this.compareDates);

                        //get the most related artist to this artist
                        getRelated({ token: res.data.access_token, id: this.$route.params.aid }).then((relatedArtist) => {
                            console.log(relatedArtist);
                            this.mostRelated = relatedArtist.data.artists[0];
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
            this.$router.push({ name: "ArtistPage", params: { aid: id } });
            this.refresh();
        }
    },
}
</script>

<template>
    <section>
        <p>{{ this.artistName }}</p>
        <button @click="goToNewArtist(this.mostRelated.id)">Related Artist: {{ this.mostRelated.name }}</button>
    </section>
    <section>
        <ul>
            <li v-for="album in this.albums">
                <div v-if="!this.isRepeat(album)" class="albumResult">
                    <img :src="album.images[0].url" alt="Album Cover">
                    <div style="display: inline-block;">
                        <h1>{{ album.name }}</h1><br>
                        <h3>{{ album.release_date }}</h3>
                    </div>
                </div>
            </li>
        </ul>
    </section>
</template>
  
<style scoped>
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
}
</style>