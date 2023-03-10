<script setup>
import TheHeader from '../components/TheHeader.vue'
import ArtistPageBody from '../components/ArtistPageBody.vue'
import TheFooter from '../components/TheFooter.vue'


</script>
<script>
export default {
    name: 'ArtistPage',
    components: {
        TheHeader, ArtistPageBody, TheFooter
    }
}

</script>
<template>
    <header>
        <TheHeader />
        <div class="wrapper">
            <ArtistPageBody />
        </div>
    </header>
    <main>
        <TheFooter />
    </main>
</template>
<style scoped></style>