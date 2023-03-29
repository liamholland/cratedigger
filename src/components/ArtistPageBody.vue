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
    <section class="px-4 py-5 text-center backg" style="color:white">
        <h1 class="display-5 fw-bold artistName" style="padding-top:10%; font-size:55px">
            <link rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <router-link type="button" class="fa fa-angle-double-left"
                style="font-size:48px;color:white; background-color:transparent; text-decoration: none; text-indent:20px"
                to="/Search"></router-link> {{ this.artist.name }}
            <button @click="toggleLikeArtist(this.artist)" type="button" class="btn btn" style=" border-color:black;">



                <svg v-if="isLikedArtist(this.artist)" xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5"
                    fill="currentColor" class="fa fa-heart" viewBox="0 0 16 16" style="color:#8C3E3E">
                    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5" fill="currentColor"
                    class="fa fa-heart" viewBox="0 0 16 16" style="color:white; font-size:48px;">
                    <path fill-rule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
            </button>
<button @click="recommendArtist" type="button" class="btn btn" style=" border-color:transparent;">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
<g id="surface1">
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;" d="M 8.640625 12 C 8.640625 13.855469 10.144531 15.359375 12 15.359375 C 13.855469 15.359375 15.359375 13.855469 15.359375 12 C 15.359375 10.144531 13.855469 8.640625 12 8.640625 C 10.144531 8.640625 8.640625 10.144531 8.640625 12 Z M 8.640625 12 "/>
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;" d="M 6.121094 12 C 6.121094 10.0625 7.09375 8.367188 8.550781 7.429688 L 7.335938 6.144531 C 7.007812 6.382812 6.695312 6.660156 6.40625 6.964844 C 5.136719 8.3125 4.4375 10.097656 4.4375 12 C 4.4375 13.902344 5.136719 15.6875 6.40625 17.035156 C 6.695312 17.339844 7.007812 17.617188 7.335938 17.855469 L 8.550781 16.570312 C 7.09375 15.632812 6.121094 13.9375 6.121094 12 Z M 6.121094 12 "/>
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;" d="M 17.878906 12 C 17.878906 13.9375 16.90625 15.632812 15.449219 16.570312 L 16.664062 17.855469 C 16.992188 17.617188 17.300781 17.339844 17.59375 17.035156 C 18.863281 15.6875 19.5625 13.902344 19.5625 12 C 19.5625 10.097656 18.863281 8.3125 17.59375 6.964844 C 17.304688 6.660156 16.992188 6.382812 16.664062 6.144531 L 15.449219 7.429688 C 16.90625 8.367188 17.878906 10.0625 17.878906 12 Z M 17.878906 12 "/>
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;" d="M 1.921875 12 C 1.921875 9.078125 3.242188 6.492188 5.292969 4.871094 L 4.09375 3.601562 C 3.777344 3.863281 3.476562 4.144531 3.191406 4.449219 C 2.269531 5.429688 1.542969 6.570312 1.03125 7.84375 C 0.507812 9.160156 0.238281 10.5625 0.238281 12 C 0.238281 13.4375 0.507812 14.839844 1.03125 16.15625 C 1.542969 17.429688 2.265625 18.570312 3.191406 19.550781 C 3.476562 19.851562 3.777344 20.136719 4.09375 20.398438 L 5.292969 19.128906 C 3.242188 17.507812 1.921875 14.921875 1.921875 12 Z M 1.921875 12 "/>
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;" d="M 22.078125 12 C 22.078125 14.921875 20.757812 17.507812 18.707031 19.128906 L 19.902344 20.382812 C 20.21875 20.125 20.523438 19.855469 20.808594 19.550781 C 21.730469 18.570312 22.457031 17.429688 22.964844 16.15625 C 23.488281 14.839844 23.757812 13.4375 23.757812 12 C 23.757812 10.5625 23.488281 9.160156 22.964844 7.84375 C 22.457031 6.570312 21.730469 5.429688 20.808594 4.449219 C 20.523438 4.148438 20.21875 3.863281 19.902344 3.601562 L 18.707031 4.871094 C 20.757812 6.492188 22.078125 9.078125 22.078125 12 Z M 22.078125 12 "/>
</g>
</svg>
            </button>
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

        <ul style="background-color:transparent">
            <li v-for="album in this.albums">
                <div class="row">
                    <div v-if="!this.isRepeat(album)">

                        <img :src="album.images[0].url" alt="Album Cover">
                        <button @click="toggleLikeAlbum(album)" type="button" class="btn btn" style="position:absolute; ">

                            <svg v-if="isLikedAlbum(album)" xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5"
                                fill="currentColor" class="fa fa-heart" viewBox="0 0 16 16" style="color:#8C3E3E; border-color:transparent">
                                <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                            </svg>

                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5" fill="currentColor"
                                class="fa fa-heart" viewBox="0 0 16 16" style="color:white; border-color:transparent;">
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
    <div class="col-lg-6 mx-auto gap" style="padding-top:10%; width: 100vw;height: 60vh;">
  </div>
</template>
      
<style scoped>
.albumResult {
    background-color: transparent;
    text-align: left;
}
.backg{
    background-image:linear-gradient(to top, #D9D9D9, black );
}

.gap{
    background-image:linear-gradient(to top, #8C3E3E, #d9d9d9)
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
    --bs-btn-bg: transparent;
    --bs-btn-border-color: #BFB1A4;
    --bs-btn-hover-color: black;
    --bs-btn-hover-bg: #D9d9d9;
    --bs-btn-hover-border-color: #BFB1A4;
    --bs-btn-focus-shadow-rgb: 130,138,145;
    --bs-btn-active-color: white;
    --bs-btn-color: white;
    --bs-btn-active-bg: #BFB1A4;
    --bs-btn-active-border-color: #BFB1A4;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: white;
    --bs-btn-disabled-bg: grey;
    --bs-btn-disabled-border-color: none;
}

.btn-get-started {
    background-color: transparent;
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
    border: 2px solid #BFB1A4;
}

.btn-get-started:hover {
    background: #BFB1A4;
    color: #d9d9d9;
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

