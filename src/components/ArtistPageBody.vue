<script>
import { app, updateSuggestedArtists, recentlySuggested, getProfileInfo, setProfileInfo, isLoggedIn } from "../../api/firebase";
import { startLoad, endLoad } from "../assets/js/frontendFunctions"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

//get componenets
const functions = getFunctions(app);
const auth = getAuth(app);

//define functions
const getToken = httpsCallable(functions, "getSpotifyToken");
const getArtist = httpsCallable(functions, "getArtist");
const getAlbums = httpsCallable(functions, "getAlbums");
const getRelated = httpsCallable(functions, "getRelatedArtists");
const getUnrelated = httpsCallable(functions, "getUnrelatedArtists");
const updateProfile = httpsCallable(functions, "updateProfile");
const broadcast = httpsCallable(functions, "broadcastToListeners");
const getInfo = httpsCallable(functions, "getArtistInfo");

//TODO: remove emulator connection on prod
// connectFunctionsEmulator(functions, "localhost", 5001);

export default {
    data() {
        return {
            //spotify search artists
            artist: "",
            genres: "",
            albums: [],
            mostRelated: "",
            leastRelated: "",
            lastSuggestedGenre: "",
            loggedIn: false,
            token: "",
            sortByNewest: true,
            info: "",
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

        //unhook the listener
        listener();

        //get a new token for spotify requests
        getToken().then((res) => {
            this.token = res.data.access_token;
            this.refresh(this.$route.params.aid, false);
        }).catch((error) => {
            console.log(error);
        });
    },
    methods: {
        //refreshes the data on the page
        refresh(artistID, onlyLikes) {
            if (!onlyLikes) {
                startLoad(this);
            }

            //get the artist
            getArtist({ token: this.token, id: artistID }).then((artist) => {
                this.artist = artist.data;
                this.genres = ""; //reset the genre
                artist.data.genres.forEach(genre => {
                    this.genres += genre + ' - ';
                });

                //get artist albums
                getAlbums({ token: this.token, id: artistID }).then((albums) => {
                    this.albums = albums.data.items.sort(this.compareDates);

                    //dont refresh the suggestions unless its a full page refresh
                    if (!onlyLikes) {

                        getInfo({artist: this.artist.name, sentences: 2}).then((artistInfo) => {
                            if(artistInfo.data.code === 0){
                                this.info = artistInfo.data.info;
                            }
                            else{
                                this.info = "";
                            }
                            
                            //get the most related artist to this artist
                            getRelated({ token: this.token, id: artistID }).then((relatedArtist) => {
                                let i = 0;
                                //while the most related was recently suggested to the user
                                do {
                                    if (i == 20) {
                                        getRelated({ token: this.token, id: relatedArtist.data.artists[19].id }).then((fallbackartists) => {
                                            i = 0;
    
                                            do {
                                                if (i == 20) {
                                                    this.mostRelated = fallbackartists.data.artists[19];
                                                    return;
                                                }
                                                this.mostRelated = fallbackartists.data.artists[i];
                                                i++;
                                            } while (recentlySuggested(this.mostRelated))
    
                                        });
                                        return;
                                    }
                                    this.mostRelated = relatedArtist.data.artists[i];
                                    i++;
                                } while (recentlySuggested(this.mostRelated))
    
                                updateSuggestedArtists(this.mostRelated);
    
                                //get artists different to the current artist
                                getUnrelated({ token: this.token, limit: 20, genres: artist.data.genres, backup: this.lastSuggestedGenre }).then((unrelatedArtist) => {
                                    console.log(unrelatedArtist.data);
    
                                    this.lastSuggestedGenre = unrelatedArtist.data.genre;
    
                                    let i = 0;
                                    do {
                                        this.leastRelated = unrelatedArtist.data.artists[i];
                                        i++;
                                    } while (recentlySuggested(this.leastRelated));
    
                                    updateSuggestedArtists(this.leastRelated);
    
                                    endLoad();
    
                                }).catch((error) => {
                                    console.log(error);
                                    endLoad();
                                });
                            }).catch((error) => {
                                console.log(error);
                                endLoad();
                            });
                        }).catch((error) => {
                            console.log(error);
                            endLoad();
                        });

                    }


                }).catch((error) => {
                    console.log(error);
                    if (!onlyLikes) {
                        endLoad();
                    }
                });
            }).catch((error) => {
                console.log(error);
                if (!onlyLikes) {
                    endLoad();
                }
            });
        },

        //like/unlike an album
        toggleLikeAlbum(album) {
            this.toggleLike(album, 'likedAlbums');
        },

        // like/unlike an artist
        toggleLikeArtist(artist) {
            this.toggleLike(artist, 'likedArtists');
        },

        //generalised function for liking items
        toggleLike(item, type) {
            //ensure the user is logged in
            if (this.loggedIn) {
                let currProfileInfo = getProfileInfo(); //make a copy of the current profile information

                //if the artist is liked, unlike it
                if (currProfileInfo[type].find(likedItem => likedItem.id == item.id)) {

                    //create a new array without the album
                    currProfileInfo[type].splice(currProfileInfo[type].indexOf(item), 1);
                    let newData = currProfileInfo[type];

                    //update the server
                    updateProfile({ field: type, value: newData }).catch((error) => {
                        console.log(error);
                    });

                    //update the local copy
                    setProfileInfo(currProfileInfo);
                    this.refresh(this.$route.params.aid, true);
                }
                else {   //otherwise like it

                    //create a new array which includes the album id
                    currProfileInfo[type].push(item);
                    let newData = currProfileInfo[type];

                    //update the server
                    updateProfile({ field: type, value: newData }).then(() => {
                        this.refresh(this.$route.params.aid, true);
                    }).catch((error) => {
                        console.log(error);
                    });

                    //update the local copy
                    setProfileInfo(currProfileInfo);
                }
            }
            else {
                console.log("Not Logged In");
            }
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
            //convert text to dates
            let date1 = new Date(d1.release_date);
            let date2 = new Date(d2.release_date);

            let sortingOrder = date1 < date2;   //default is oldest first
            if(this.sortByNewest){
                sortingOrder = date1 > date2;   //switch to newest first    
            }

            if (sortingOrder) { //dependent on the sorting order
                return -1;
            }
            else if (date1 === date2) {
                return 0;
            }
            else {
                return 1;
            }
        },

        sortBy(value){
            this.sortByNewest = value;
            this.refresh(this.$route.params.aid, true);
        },

        goToNewArtist(id) {
            if (this.loggedIn) {
                updateProfile({ field: 'suggestedArtists', value: getProfileInfo().suggestedArtists }).catch((error) => {
                    console.log(error);
                });
            }

            this.$router.push({ name: "ArtistPage", params: { aid: id } });
            this.refresh(id, false);
        },

        isLikedAlbum(album) {
            return this.checkLike(album, getProfileInfo().likedAlbums);
        },

        isLikedArtist(artist) {
            return this.checkLike(artist, getProfileInfo().likedArtists);
        },

        //generalised function for checking the status of likes
        checkLike(item, array) {
            if (this.loggedIn && array.length > 0) {
                return array.find((likedItem) => likedItem.id == item.id);
            }
            else {
                return false;
            }
        },

        recommendArtist() {
            if (this.loggedIn) {
                startLoad(this);
                broadcast({ artist: this.artist }).then((result) => {
                    console.log(result.data);
                    endLoad();
                }).catch((error) => {
                    console.log(error);
                    endLoad();
                });
            }
            else {
                console.log("Not Logged In");
            }
        },
    },
}
</script>

<template class="body">
    <section class="px-4 py-5 text-center" style="color:white; background-color:black">
        <h1 class="display-5 fw-bold artistName" style="padding-top:10%; font-size:55px">
            <link rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <router-link type="button" class="fa fa-angle-double-left"
                style="font-size:48px;color:white; background-color:black; text-decoration: none; text-indent:20px"
                to="/Search"></router-link> {{ this.artist.name }}
            <button @click="toggleLikeArtist(this.artist)" type="button" class="btn btn" style=" border-color:black;">



                <svg v-if="isLikedArtist(this.artist)" xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5"
                    fill="currentColor" class="fa fa-heart" viewBox="0 0 16 16" style="color:1DB954">
                    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5" fill="currentColor"
                    class="fa fa-heart" viewBox="0 0 16 16" style="color:white; font-size:48px;">
                    <path fill-rule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
            </button>

            <button @click="recommendArtist" type="button" class="btn btn" style=" border-color:black;">Recommended To
                Listeners</button>
        </h1>




        <div class="col-lg-6 mx-auto">
            <p class="artistGenre">{{ this.genres }}</p><br>
            <p class="artistGenre">{{ this.info }}</p>
            <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <button type="button" class="btn btn-lg px-4 gap-3 btn-get-started"
                    @click="goToNewArtist(this.mostRelated.id)">Related Artist: {{ this.mostRelated.name
                    }}</button>
                <button type="button" class="btn btn-lg px-4 gap-3 btn-get-started"
                    @click="goToNewArtist(this.leastRelated.id)">Unrelated Artist: {{
                        this.leastRelated.name }}</button>

            </div>
        </div>
        <br><br><br>


        <div class="col-lg-6 mx-auto">
            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-secondary" :class="{active: this.sortByNewest}">
                    <input type="radio" style="display: none;" id="Newest" autocomplete="off" checked @click="sortBy(true)"> Newest
                </label>
                <label class="btn btn-secondary"  :class="{active: !this.sortByNewest}">
                    <input type="radio" style="display: none;" id="Oldest" autocomplete="off" @click="sortBy(false)"> Oldest
                </label>
            </div>
        </div>
        <br><br><br>

        <ul style="background-color:black">
            <li v-for="album in this.albums">
                <div class="row">
                    <div v-if="!this.isRepeat(album)">

                        <img :src="album.images[0].url" alt="Album Cover">
                        <button @click="toggleLikeAlbum(album)" type="button" class="btn btn" style="position:absolute; ">

                            <svg v-if="isLikedAlbum(album)" xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5"
                                fill="currentColor" class="fa fa-heart" viewBox="0 0 16 16" style="color:1DB954">
                                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                            </svg>

                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5" fill="currentColor"
                                class="fa fa-heart" viewBox="0 0 16 16" style="color:white">
                                <path fill-rule="evenodd"
                                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                            </svg>
                        </button>


                    </div>


                    <div class="col-2.5">


                        <h1 style="font-size:14px"> {{ album.name }} </h1>



                        <h3 style="font-size:12px">{{ album.release_date }}</h3>



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

.btn-secondary {
    --bs-btn-color: #1DB954;
    --bs-btn-bg: black;
    --bs-btn-border-color: black;
    --bs-btn-hover-color: black;
    --bs-btn-hover-bg: #137234;
    --bs-btn-hover-border-color: black;
    --bs-btn-focus-shadow-rgb: 130,138,145;
    --bs-btn-active-color: black;
    --bs-btn-active-bg: #1DB954;
    --bs-btn-active-border-color: none;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #1DB954;
    --bs-btn-disabled-bg: black;
    --bs-btn-disabled-border-color: none;
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
    height: 180px;
    width: 180px;
}
</style>

