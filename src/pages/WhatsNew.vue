<script setup>
import TheHeader from '../components/TheHeader.vue'
import WhatsNewBody from '../components/WhatsNewBody.vue'
import TheFooter from '../components/TheFooter.vue'


</script>
<script>
export default {
  name: 'AboutUs',
  components: {
    TheHeader,WhatsNewBody, TheFooter
   }
}

</script>
<template>

<header>
    <TheHeader />
<div class="wrapper">

    <WhatsNewBody />

</div>
</header>
<main>
<TheFooter />
</main>
</template>
<style scoped>
</style>