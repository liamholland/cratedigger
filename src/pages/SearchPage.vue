<script setup>
import TheHeader from '../components/TheHeader.vue'
import SearchBody from '../components/SearchBody.vue'
import TheFooter from '../components/TheFooter.vue'

</script>
<script>
export default {
  name: 'BlogOne',
  components: {
    TheHeader, SearchBody, TheFooter,
   }
}

</script>
<template>

<header>
    <TheHeader />
<div class="wrapper">
<SearchBody />
</div>
</header>
<main>
<TheFooter/>
</main>
</template>
<style scoped>
</style>