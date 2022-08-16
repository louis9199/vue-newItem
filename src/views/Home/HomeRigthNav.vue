<template>
  <el-scrollbar wrap-class="scrollWrap" :native="false">
    <ul class="navWrap">
      <!-- showFood需要传参数，所以调用的时候一定要把括号带上，不然后参数为事件对象 -->
      <li :class="{ active: 0 == cur }" @click="showFood()">
        <span class="iconfont">&#xe60b;</span>
        <span class="text">推荐</span>
      </li>
      <li
        v-for="(nav, index) in navs"
        :key="nav.id"
        :class="{ active: index + 1 == cur }"
        @click="showFood(index + 1, nav.id)"
      >
        <span class="iconfont" v-html="nav.icon"></span>
        <span class="text">{{ nav.name }}</span>
      </li>

      <!-- 因为推荐并没有参与循环，所以它有一个索引值，而循环的li索引值应该从1开始 -->
    </ul>
  </el-scrollbar>
</template>

<script>
export default {
  name: 'navBar',
  data() {
    return {
      cur: 0 //默认状态下为0，显示推荐
    }
  },
  mounted() {
    this.getFood()
    this.$getCategory() //获取分类数据
  },
  computed: {
    navs() {
      return this.$store.getters.getCategory
    }
  },
  methods: {
    showFood(index = 0, id = 0) {
      this.cur = index
      this.getFood({ category_id: id })
    },
    getFood(data) {
      this.$fetch({
        //请求菜品分类的数据
        url: '/api/dish_lists',
        data
      }).then((res) => {
        this.$set(res, 'curCategoryId', data ? data.category_id : 0)
        this.$store.commit('updateFoodList', res) //更新状态
      })
    }
  }
}
</script>

<style scoped>
.navWrap {
  display: flex;
}
.navWrap li {
  font-size: 24px;
  margin-right: 25px;
  cursor: pointer;
  list-style: none;
}
.navWrap li:hover,
.navWrap li.active {
  color: #f9d163;
}
.navWrap li span.iconfont {
  font-size: 26px;
  margin-right: 5px;
}
</style>