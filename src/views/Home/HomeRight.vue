<template>
  <div>
    <div id="navBar">
      <Nav />
      <Search />
    </div>
    <div id="content">
      <Foodlist />
    </div>
  </div>
</template>

<script>
import Nav from './HomeRigthNav.vue'
import Search from './HomeRightSearch.vue'
import Foodlist from './HomeRightFoodList.vue'
export default {
  name: 'HomeRight',
  components: {
    Nav,
    Search,
    Foodlist
  }
}
</script>

<style>
</style>