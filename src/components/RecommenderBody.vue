<script>
import { app, isLoggedIn, getProfileInfo, setProfileInfo, updateSuggestedArtists, recentlySuggested, getUID } from "../../api/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

//get componenets
const functions = getFunctions(app);
const auth = getAuth(app);

//define the function
const getToken = httpsCallable(functions, "getSpotifyToken");
const recommend = httpsCallable(functions, "recommendArtists");
const update = httpsCallable(functions, "updateProfile");

//TODO: remove emulator connection on prod
connectFunctionsEmulator(functions, "localhost", 5001);

export default {
    data() {
        return {
            token: "",
            currentSuggestion: {},
            loggedIn: false,
            genres: "",
        }
    },
    beforeCreate() {
        if (isLoggedIn()) {
            this.loggedIn = true;
            getToken().then((result) => {
                this.token = result.data.access_token;
                this.refreshRecommendation();
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            this.loggedIn = false;
        }
        
    },
    mounted(){
        this.loggedIn = isLoggedIn();
    },
    // watch: {
    //     loggedIn(){
    //         this.loggedIn = true;
    //         this.refreshRecommendation();
    //     }
    // },
    methods: {
        refreshRecommendation() {

            recommend({ token: this.token, user: getProfileInfo() }).then((recommendation) => {
                console.log(recommendation.data);
                if(recentlySuggested(recommendation.data.artist)){  // || recommendation.data.code == 1
                    this.refreshRecommendation();
                }
                else{
                    this.currentSuggestion = recommendation.data.artist;
                    this.genres = "";
                    this.currentSuggestion.genres.forEach((genre) => {
                        this.genres += genre + ' , ';
                    });
                }
            });
        },

        likeArtist() {
            if(this.currentSuggestion != null){
                let currProfileInfo = getProfileInfo(); //make a copy of the current profile information
                console.log(currProfileInfo);
                currProfileInfo.likedArtists.push(this.currentSuggestion);
                let newData = currProfileInfo.likedArtists;
    
                
                setProfileInfo(currProfileInfo);
                updateSuggestedArtists(this.currentSuggestion);
    
                update({id: getUID(), field: 'likedArtists', value: newData}).then((result) => {
                    console.log(result.data);
                    this.refreshRecommendation();
                }).catch((error) => {
                    console.log(error);
                });
            }          
        },

        skipArtist(){
            if(this.currentSuggestion != null){
                updateSuggestedArtists(this.currentSuggestion);
    
                let newData = getProfileInfo().suggestedArtists;
    
                update({id: getUID(), field: 'suggestedArtists', value: newData}).then((result) => {
                    console.log(result.data);
                    this.refreshRecommendation();
                }).catch((error) => {
                    console.log(error);
                });
            }
        },
    },
    computed: {
        artistImage(){
            return JSON.stringify(this.currentSuggestion) != '{}' ? this.currentSuggestion.images[0].url : "";
        }
    }
}

</script>

<template >
    <div v-if="loggedIn">
        <meta charset="utf-8">
        <section class="hero">
            <p class="artistName">{{ this.currentSuggestion.name }}</p><br>
            <p class="artistGenre">{{ this.genres }}</p>
        </section>
        
        <section id="hero" class="hero">
            <button @click="likeArtist" class="btn-get-started">Like</button>
            <img :src="artistImage" :alt="this.currentSuggestion.name">
            <button @click="skipArtist" class="btn-get-started">Don't Like</button>
        </section>
    </div>
    <div v-else>
        <p>Not Logged In</p>
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
}
</style>