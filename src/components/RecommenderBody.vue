<script>
import { app, isLoggedIn, getProfileInfo, setProfileInfo, updateSuggestedArtists, recentlySuggested } from "../../api/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { startLoad, endLoad, openModal } from "../assets/js/frontendFunctions"
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

//get componenets
const functions = getFunctions(app);
const auth = getAuth(app);

//define the function
const getToken = httpsCallable(functions, "getSpotifyToken");
const recommend = httpsCallable(functions, "recommendArtists");
const update = httpsCallable(functions, "updateProfile");

//TODO: remove emulator connection on prod
// connectFunctionsEmulator(functions, "localhost", 5001);

export default {
    data() {
        return {
            token: "",
            currentSuggestion: {},
            loggedIn: false,
            genres: "",
            loading: false,
            noProfile: false,
        }
    },
    created() {
        let listener = onAuthStateChanged(auth, (user) => {
            if (user) {
                if(isLoggedIn()){
                    this.loggedIn = true;
                    getToken().then((result) => {
                        this.token = result.data.access_token;
                        this.refreshRecommendation();
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                else{
                    this.noProfile = true;
                }
            }
            else {
                this.loggedIn = false;
            }
        });
        listener();
    },
    methods: {
        refreshRecommendation() {
            if (!this.loading) {
                startLoad(this);
                this.loading = true;
            }

            recommend({ token: this.token, user: getProfileInfo() }).then((recommendation) => {
                console.log(recommendation.data);
                if (recentlySuggested(recommendation.data.artist)) {  // || recommendation.data.code == 1
                    this.refreshRecommendation();
                }
                else {
                    this.currentSuggestion = recommendation.data.artist;
                    this.genres = "";
                    this.currentSuggestion.genres.forEach((genre) => {
                        this.genres += genre + ' , ';
                    });
                    endLoad();
                    this.loading = false
                }
            });
        },

        likeArtist() {
            if (this.currentSuggestion != null) {
                let currProfileInfo = getProfileInfo(); //make a copy of the current profile information
                console.log(currProfileInfo);
                currProfileInfo.likedArtists.push(this.currentSuggestion);
                let newData = currProfileInfo.likedArtists;


                setProfileInfo(currProfileInfo);
                updateSuggestedArtists(this.currentSuggestion);

                if (newData !== null) {
                    update({ field: 'likedArtists', value: newData }).then((result) => {
                        console.log(result.data);
                        this.refreshRecommendation();
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        },

        skipArtist() {
            if (this.currentSuggestion != null) {
                updateSuggestedArtists(this.currentSuggestion);

                let newData = getProfileInfo().suggestedArtists;

                if (newData !== null) {
                    update({ field: 'suggestedArtists', value: newData }).then((result) => {
                        console.log(result.data);
                        this.refreshRecommendation();
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        },

        opensignin() {
            openModal(0);
        },

        opensignup() {
            openModal(1);
        }
    },
    computed: {
        artistImage() {
            return JSON.stringify(this.currentSuggestion) != '{}' ? this.currentSuggestion.images[0].url : "";
        }
    }
}

</script>

<template >
    <div v-if="loggedIn">
        <section class="px-4 py-5 text-center" style="width: 100vw; height: 100vh; color:white; background-color:black">
            <h1 class="display-5 fw-bold" style="padding-top:10%">Artist: {{ this.currentSuggestion.name }}</h1>
            <div class="col-lg-6 mx-auto">
                <p class="lead mb-4">Genres: {{ this.genres }}</p>


                <div class="container px-1">
                    <button style="background-color:black; padding-left:15px; border: none; font-size:150%"
                        @click="skipArtist">&#10060;</button>
                    <img :src="artistImage" :alt="this.currentSuggestion.name" class="img-fluid rounded-3 " width="180"
                        height="180" loading="lazy">
                    <button style="background-color:black; padding-right:15px; border: none; font-size:150%"
                        @click="likeArtist">&#9989;</button>

                </div>





            </div>
        </section>

    </div>
    <div v-else-if="noProfile">
        <section class="px-4 py-5 text-center" style="width: 100vw; height: 100vh; color:white; background-color:black">

            <div class="col-lg-6 mx-auto" style="padding-top:10%">
                <h4 class="lead mb-4" style="color:white; ">Visit your account page first so we can adjust your recommendations!</h4>
                <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">

                </div>
            </div>
        </section>
    </div>
    <div v-else>
        <section class="px-4 py-5 text-center" style="width: 100vw; height: 100vh; color:white; background-color:black">

            <div class="col-lg-6 mx-auto" style="padding-top:10%">
                <h4 class="lead mb-4" style="color:white; ">You are not logged into your account. To login click <h3
                        style="display:inline"><strong><a @click="opensignin()">here</a></strong></h3> or to create an
                    account click
                    <h3 style="display:inline"><strong><a @click="opensignup()">here</a></strong></h3>
                </h4>
                <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">

                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.hero {
    text-align: center;
    background-color: black;
    padding-top: 12.5%;
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
    color: black;
    text-decoration: none;
    border: 2px solid #1DB954;
}

.btn-get-started:hover {
    background: #1DB954;
    color: black;
}

.artistName {
    color: white;
    font-size: 100px;
    text-align: center;
}

.artistGenre {
    color: white;
    font-size: 20px;
    text-align: center;
}</style>