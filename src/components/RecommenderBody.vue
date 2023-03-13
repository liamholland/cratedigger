<script>
import { app } from "../../api/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

//get componenets
const functions = getFunctions(app);
const auth = getAuth(app);

export default {
    data() {
        return {
            currentSuggestion: {},
        }
    },
    created() {

    },
}

</script>

<template >
    <meta charset="utf-8">
    <section id="hero" class="hero">
        <button class="btn-get-started">Like</button>
        <img :src="this.currentSuggestion.url" :alt="this.currentSuggestion.name">
        <button class="btn-get-started">Don't Like</button>
    </section>
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
</style>