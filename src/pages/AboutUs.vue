<script setup>
import TheHeader from '../components/TheHeader.vue'
import AboutUsBody from '../components/AboutUsBody.vue'
import TheFooter from '../components/TheFooter.vue'


</script>
<script>
export default {
  name: 'AboutUs',
  components: {
    TheHeader,AboutUsBody, TheFooter
   }
}

</script>
<template>

<header>
    <TheHeader />
<div class="wrapper">

    <AboutUsBody />

</div>
</header>
<main>
<TheFooter />
</main>
</template>
<style scoped>
</style>