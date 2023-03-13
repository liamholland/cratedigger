<script setup>
import TheHeader from '../components/TheHeader.vue'
import Recommender from '../components/RecommenderBody.vue'
import TheFooter from '../components/TheFooter.vue'

</script>
<script>
export default {
  name: 'HomeOne',
  components: {
    TheHeader, Recommender, TheFooter,
  },
}

</script>

<template>
  <header>
    <TheHeader />
    <div class="wrapper">
      <Recommender />
    </div>
  </header>
  <main>
    <TheFooter />
  </main>
</template>
<style scoped></style>