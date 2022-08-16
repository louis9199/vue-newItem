<template>
  <el-scrollbar wrap-class="scrollWrap" :native="false" id="content">
    <Nodata v-if="!ordered.length"></Nodata>
    <ul class="orderBox" v-if="ordered.length">
      <li v-for="(table, tableIndex) in ordered" :key="table.table_id">
        <table>
          <tbody>
            <tr
              v-for="(dish, dishIndex) in table.order_items"
              :key="dish.dish_id"
            >
              <td>{{ dishIndex + 1 }}</td>
              <td>
                <img
                  :src="'http://order-api.chenxuehui.com/' + dish.image"
                  alt=""
                />
              </td>
              <td>{{ dish.name }}</td>
              <td>
                <button>
                  <span
                    class="iconfont"
                    @click="addOrDel(dish, -1, table.table_id)"
                    >&#xe605;</span
                  >
                </button>
                <span class="num">{{ dish.num }}</span>
                <button>
                  <span
                    class="iconfont"
                    @click="addOrDel(dish, 1, table.table_id)"
                    >&#xe603;</span
                  >
                </button>
              </td>
              <td>￥{{ dish.num }} x {{ dish.price }}</td>
              <td>{{ dish.remarks }}</td>
              <td>
                <button class="select" @click="select(dish, table.table_id)">
                  <span class="iconfont" v-if="dish.selected">&#xe641;</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="foot">
          <div>
            <span
              >桌号：<strong>{{ table.table_id }}</strong
              >号桌</span
            >
            <span>人数：{{ table.people_number }}</span>
            <span>订单号：{{ table.order_sn }}</span>
            <button class="addDishes" @click="addDishes(table.table_id)">
              添菜
            </button>
          </div>
          <div>
            <span
              >总消费：￥<strong>{{ totalPrice(tableIndex) }}</strong></span
            >
            <button class="pay" @click="submitOrder(table)">下单</button>
          </div>
        </div>
      </li>
    </ul>
  </el-scrollbar>
</template>

<script>
import Nodata from '../Nodata.vue'
export default {
  components: { Nodata },
  computed: {
    ordered() {
      return this.$store.getters.getOrdered //获取已点数据
    },
    totalPrice() {
      return function (tableIndex) {
        let total = 0
        this.ordered[tableIndex].order_items.forEach((dish) => {
          total += dish.num * dish.price
        })
        return total
      }
    },
    curTableId() {
      return this.$store.getters.getTables.cur_id
    }
  },
  methods: {
    addOrDel(dish, num, table_id) {
      dish.num += num
      dish.selected = true
      if (dish.num <= 0) {
        dish.num = 0
        dish.selected = false
      }
      //重新点菜
      this.orderDishes(dish, table_id)
    },
    select(dish, table_id) {
      dish.selected = !dish.selected
      this.orderDishes(dish, table_id) //重新请求点餐数据
    },
    //封装一个重新点餐数据的方法
    orderDishes(dish, table_id) {
      this.$fetch({
        url: '/api/add_order_item',
        method: 'POST',
        data: {
          table_id,
          dish_id: dish.dish_id,
          num: dish.num,
          remarks: dish.remarks,
          selected: dish.selected
        }
      })
    },

    addDishes(table_id) {
      //添菜
      if (table_id != this.curTableId) {
        //添菜的时候跳转的时候 如果桌号和 现桌号不一致则要更改
        this.$fetch({
          url: '/api/choose_table',
          method: 'POST',
          data: {
            table_id
          }
        }).then(() => {
          this.$store.commit('updateCurId', table_id)
        })
      }
      this.$router.push('/')
    },
    submitOrder(table) {
      //下单
      this.$fetch({
        url: '/api/submit_order',
        method: 'POST',
        data: {
          order_id: table.order_id
        }
      }).then(() => {
        this.$getOrdered() //获取已点的数据
        this.$getShopped() //获取到已下单的数据
        //如果下单的桌号与当前桌子的id一样，就删除当前桌子的id
        if (table.table_id == this.curTableId) {
          this.$store.getters.getTables.cur_id = 0
        }
      })
    }
  }
}
</script>

<style scoped>
.addDishes {
  width: 50px;
  height: 25px;
  background: #a65335;
  border-radius: 5px;
  border: none;
}
.pay {
  width: 80px;
  height: 35px;
  background: #ff8400;
  font-style: 18px;
  border: none;
  border-radius: 5px;
}
</style>