<script setup>
import TheHeader from '../components/TheHeader.vue'
import HomeBody from '../components/HomeBody.vue'
import TheFooter from '../components/TheFooter.vue'

</script>
<script>
export default {
  name: 'HomeOne',
  components: {
  TheHeader, HomeBody,TheFooter,
   }
}

</script>





<template>

<header>
    <TheHeader />
<div class="wrapper">
<HomeBody/>
</div>
</header>
<main>
<TheFooter />
</main>
</template>
<style scoped>
</style>