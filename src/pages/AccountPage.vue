<script setup>
import TheHeader from '../components/TheHeader.vue'
import AccountPageBody from '../components/AccountPageBody.vue'
import TheFooter from '../components/TheFooter.vue'


</script>
<script>
export default {
  name: 'AboutUs',
  components: {
    TheHeader, AccountPageBody, TheFooter
  }
}

</script>
<template>

<header>
    <TheHeader />
<div class="wrapper">


    <AccountPageBody />

 

</div>
</header>
<main>
<TheFooter />
</main>
</template>
<style scoped>
</style>