<template>
  <el-scrollbar wrap-class="scrollWrap" :native="false" id="content">
    <div>
      <ul class="foodList">
        <li v-for="food in foodList" :key="food.dish_id">
          <img
            :src="'http://order-api.chenxuehui.com/' + food.image"
            @click="showDetail(food)"
          />
          <span class="iconfont recommend" v-if="food.recommend">&#xe60b;</span>
          <div class="bar">
            <h3>{{ food.name }}</h3>
            <p>
              <span class="rmb">RMB</span>
              <span class="price">{{ food.price }}元/份</span>
              <button>
                <span class="iconfont" @click="showFoodAttr(food)"
                  >&#xe603;</span
                >
              </button>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <Detail
      v-if="detailedShow"
      @closeDetailed="detailedShow = false"
      :food="curFood"
    ></Detail>

    <el-dialog
      :title="curFood.name"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      width="30%"
      top="30vh"
      custom-class="attrDialog"
    >
      <div class="dishHead">
        <div class="title">
          <p class="price">
            ￥<strong>{{ curFood.price }}</strong>
          </p>
          <p class="star">
            <el-rate
              v-model="curFood.stars"
              disabled
              text-color="#ff9900"
            ></el-rate>
          </p>
        </div>
        <div class="control">
          <button>
            <span class="iconfont" @click="addOrDel(-1)">&#xe605;</span>
          </button>
          <span>{{ curFood.num }}</span>
          <button>
            <span class="iconfont" @click="addOrDel(1)">&#xe603;</span>
          </button>
        </div>
      </div>
      <el-input
        type="textarea"
        rows="8"
        placeholder="请输入备注"
        v-model="curFood.remarks"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-scrollbar>
</template> 

<script>
import Detail from './HomeDetail.vue'
export default {
  name: 'Foodlist',
  data() {
    return {
      detailedShow: false,
      curFood: {}, //当前点击的菜品数据
      dialogVisible: false
    }
  },
  components: {
    Detail
  },
  computed: {
    foodList() {
      return this.$store.getters.getFoodList.lists.docs //获取对应的数据，数据请求在nav中已经发送
    },
    tableId() {
      return this.$store.getters.getTables.cur_id //获取当前客户所在的桌子
    },
    ordered() {
      return this.$store.getters.getOrdered //获取已点的数据
    }
  },
  methods: {
    showDetail(food) {
      this.detailedShow = true
      this.curFood = food
    },
    showFoodAttr(food) {
      //第一、没有自己的桌位进入菜单，要先选桌子
      if (!this.tableId) {
        this.$alert('请选择桌位')
          .then(() => {
            this.$router.push('/table')
          })
          .catch(() => {})
        return
      }
      //第二、 选座了 没点菜
      this.dialogVisible = true
      this.curFood = food
      this.$set(this.curFood, 'num', 1)

      //第三、选座了 也点菜了，在dialog中显示已点信息
      //先找桌子
      const orderTable = this.ordered.find((table) => {
        table.table_id == this.tableId
      })
      //再找菜
      const orderDish =
        orderTable &&
        orderTable.order_items.find((dish) => {
          dish.dish_id == food.dish_id
        })

      if (orderDish) {
        this.curFood = orderDish //将菜品信息赋值给curfood
        this.$set(this.curFood, 'stars', food.stars)
      }
    },
    addOrDel(num) {
      this.curFood.num += num
      if (this.curFood.num <= 0) {
        this.curFood.num = 0
      }
    },
    confirm() {
      if (!this.curFood.num) {
        this.$alert('点餐数量不能为空')
        return
      }
      this.dialogVisible = false
      this.$fetch({
        url: '/api/add_order_item',
        method: 'POST',
        data: {
          table_id: this.tableId,
          dish_id: this.curFood.dish_id,
          num: this.curFood.num,
          remarks: this.curFood.remarks,
          selected: true
        }
      }).then(() => {
        this.$getOrdered() //更新已点的数据
      })
    }
  }
}
</script>

<style scoped>
.foodList {
  font-size: 0;
}
.foodList li {
  display: inline-block;
  position: relative;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
}
.foodList img {
  width: 350px;
  height: 350px;
  cursor: pointer;
}
.recommend {
  position: absolute;
  left: 5px;
  top: 5px;
  font-size: 50px;
  color: #ff8400;
}
.foodList .bar {
  width: 100%;
  /* height: 40px; */
  color: #fff;
  font-size: 16px;
  line-height: 40px;
  box-sizing: border-box;
  padding: 0 10px;
  background: rgba(0, 0, 0, 0.6);

  display: flex;
  justify-content: space-between;

  position: absolute;
  bottom: 0;
}
.foodList .bar p {
  display: flex;
  align-items: center;
}
.foodList .rmb {
  font-size: 14px;
}
.foodList .price {
  color: #f0e184;
  margin: 0 10px;
}
.foodList .bar button {
  width: 30px;
  height: 30px;
  line-height: 20px;
  background: #ff8400;
  color: #fff;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}
.foodList .bar button span {
  font-size: 14px;
}

/* 菜品属性弹出层 */
.dishHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.dishHead .price {
  font-size: 20px;
  color: #ff8400;
}
.dishHead .control {
  display: flex;
}
.dishHead .control button {
  width: 24px;
  height: 24px;
  background: #ff8400;
  color: #fff;
  border: none;
  cursor: pointer;
}
.dishHead .control > span {
  width: 30px;
  height: 24px;
  line-height: 24px;
  box-sizing: border-box;
  text-align: center;
  border-top: 1px solid #ff8400;
  border-bottom: 1px solid #ff8400;
}
</style>

<style>
.attrDialog {
  border-radius: 8px;
}
.attrDialog .el-dialog__body {
  padding: 10px 20px;
}
.attrDialog .el-button--primary {
  background: #ff8400;
  border: none;
}
.attrDialog .el-button:hover {
  background: #ffac52;
  border-color: transparent;
  color: #fff;
}
.attrDialog .el-dialog__headerbtn {
  font-size: 22px;
}
.attrDialog .el-rate__icon {
  font-size: 20px;
  margin-right: 0;
}
.attrDialog .el-dialog__title {
  font-size: 28px;
}

.attrDialog .el-textarea__inner,
.attrDialog .el-textarea__inner:hover {
  border: 1px solid #ff8400;
}
</style>

