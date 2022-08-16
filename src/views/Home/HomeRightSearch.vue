<template>
  <div>
    <div class="search">
      <input type="text" v-model="keywords" @click.keyup="search" />
      <button @click="search">
        <span class="iconfont">&#xe63e;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      keywords: ''
    }
  },
  computed: {
    categoryId() {
      return this.$store.getters.getFoodList.curCategoryId
    }
  },
  methods: {
    search() {
      this.$fetch({
        //请求数据，根据categoryId，请求相对应的内容
        url: '/api/dish_lists',
        data: {
          keywords: this.keywords,
          category_id: this.categoryId
        }
      }).then((res) => {
        this.$store.commit('updateFoodList', res) //更新状态，让foodlist栏显示自己的搜索内容
        this.keywords = '' //清空搜索栏
      })
    }
  }
}
</script>

<style scoped>
.search {
  width: 300px;
  height: 30px;
  box-sizing: border-box;
  display: flex;
  border: 1px solid #fff;
  border-radius: 50px;
}
.search input {
  background: none;
  border: none;
  width: 270px;
  font-size: 16px;
  color: #fff;
  padding-left: 15px;
}
.search button {
  background: none;
  border: none;
  width: 30px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>