<template>
  <div>
    <div>
      <dl class="table">
        <dt>桌台数据</dt>
        <dd>
          <div>
            <strong>{{ tables.length }}</strong>
            <span>开桌数</span>
          </div>
        </dd>
        <dd>
          <div>
            <strong>{{ freeNum }}</strong>
            <span>空闲数</span>
          </div>
        </dd>
        <dd>
          <div>
            <strong>{{ orderingNum }}</strong>
            <span>点餐数</span>
          </div>
        </dd>
        <dd>
          <div>
            <strong>{{ eating.length }}</strong>

            <span>下单数</span>
          </div>
        </dd>
      </dl>
    </div>
    <div class="list">
      <h3>桌台模式</h3>
      <ul>
        <li
          v-for="table in tables"
          :key="table.table_id"
          :class="{ eating: table.status == 2, ordering: table.status == 1 }"
        >
          <div>
            <span class="iconfont">&#xee58;</span>{{ table.table_id }}号桌
            <button v-if="table.status == 2" @click="lookOrder(table.table_id)">
              查看订单
            </button>
          </div>
          <p>
            <span>{{ statusText[table.status] }}</span>
            <span>{{ table.people_number }}人</span>
          </p>
        </li>
        <li class="add" @click="addTable">
          <span class="iconfont">&#xe608;</span>
        </li>
      </ul>
    </div>
    <el-drawer
      :title="curTable.table_id + '号桌订单列表'"
      :visible.sync="drawer"
      :size="600"
      custom-class="myDrawer"
    >
      <el-table :data="curTable.lists">
        <el-table-column prop="name" label="菜名" width="200"></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column label="是否上菜" width="200">
          <template slot-scope="scope">
            <!-- {{ scope.row.date }} -->
            <!-- scope.row是上面的菜品数据curTable -->
            <el-switch
              v-model="scope.row.status"
              active-color="#ff8400"
              inactive-color="#ccc"
              :disabled="scope.row.status"
              @click="switchChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="orderMessage">
        <div>
          <p>订单号：16254586548{{ curTable.order_item_id }}</p>
          <p>下单时间：16：23：15{{ curTable.order.created_at }}</p>
          <p>
            共消费: <strong>{{ curTable.order.amount }}</strong>
          </p>
        </div>
        <button @click="pay">结账</button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statusText: ['空闲中', '点餐中', '用餐中'],
      drawer: false,
      curTable: {
        lists: [],
        order: {}
      }
    }
  },
  mounted() {
    this.$getTable() //获取桌位总数
    this.$getOrdered() //已点菜品
    this.$getShopped() //正在用餐桌数
  },
  computed: {
    //当前桌子数量
    tables() {
      return this.$store.getters.getTables.list
    },
    //正在用餐
    eating() {
      return this.$store.getters.getShopped
    },
    //正在点餐
    orderingNum: function () {
      return this.$store.getters.getOrdered.length
    },
    //空闲数
    freeNum() {
      return this.tables.length - this.eating.length - this.orderingNum
    }
  },
  methods: {
    addTable() {
      this.$fetch({
        url: '/api/inc_table_number',
        method: 'POST'
      }).then(() => this.$getTable())
    },
    lookOrder(table_id) {
      this.drawer = true

      //请求数据
      this.$fetch({
        url: '/api/table_order_item',
        data: {
          table_id
        }
      }).then((res) => {
        this.curTable = res
        this.$set(this.curTable, 'table_id', table_id) //添加桌号的数据，当前 请求的数据没有
      })
    },
    switchChange(food) {
      //console.log(food)
      //发送上菜数据
      this.$fetch({
        url: '/api/send_dish',
        method: 'POST',
        data: {
          id: food.order_item_id
        }
      }).then(() => {
        this.$alert('上菜成功')
      })
    },
    pay() {
      if (this.curTable.lists.some((item) => !item.status)) {
        this.$alert('还有菜未上完')
        return
      }
      //结账
      this.$fetch({
        url: '/api/settle_order',
        method: 'POST',
        data: {
          id: this.curTable.order.order_id
        }
      }).then(() => {
        this.drawer = false //收回抽屉

        this.$getTable() //更新桌子的数据
        this.$getShopped() //更新已下单的数据
      })
    }
  }
}
</script>

<style scoped>
.table {
  background: #fff;
  border-radius: 5px;
}
.table dt,
.list h3 {
  font-size: 20px;
  font-weight: bold;
  color: #ff8400;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  padding-left: 20px;
}
.table dd {
  display: inline-block;
  padding: 10px;
}
.table dd div {
  width: 110px;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}
.table dd strong {
  font-size: 24px;
  margin-bottom: 10px;
  color: #ff8400;
}
.table dd span {
  color: #aaa;
}
.table dd div:after {
  content: '';
  width: 1px;
  height: 100%;
  position: absolute;
  background: linear-gradient(#fff, #ccc, #fff);
  right: 0;
}

.list {
  background: #fff;
  border-radius: 5px;
  margin-top: 20px;
}
.list ul {
  padding: 20px;
  overflow: hidden;
}
.list li {
  width: 200px;
  height: 150px;
  border: 1px solid #afafaf;
  float: left;
  border-radius: 5px;
  overflow: hidden;
  margin: 14px;
}
.list li div {
  height: 100px;
  background: #898989;
  color: #fff;
  text-align: center;
  font-size: 30px;
  line-height: 100px;

  position: relative;
  overflow: hidden;
}
.list li div span {
  font-size: 30px;
  margin-right: 12px;
}
.list li p {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}
.list li div button {
  width: 100%;
  height: 100%;
  background: #66a8a6;
  font-size: 22px;
  color: #fff;

  position: absolute;
  left: 0;
  top: -100px;
  transition: 0.3s;
}
.list li.eating {
  border-color: #e5553f;
}
.list li.eating div {
  background: #e5553f;
  cursor: pointer;
}
.list li.eating p {
  color: #e5553f;
}
.list li.eating:hover button {
  top: 0;
  border: none;
}

.list li.ordering {
  border-color: #fc9723;
}
.list li.ordering div {
  background: #fc9723;
}
.list li.ordering p {
  color: #fc9723;
}

.list .add {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.list .add span {
  font-size: 120px;
  color: #ccc;
}
.list .add:hover {
  background: #eee;
  transition: 0.3s;
}

/*
    wechart:haokeruyi
 */

/* 抽屉里的最下面的样式 */
.orderMessage {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fbfbfb;
  padding: 20px 10px;

  font-size: 14px;
  margin-top: 20px;
}
.orderMessage div {
  display: flex;
  flex-direction: column;
  color: #9e9e9e;
}

.orderMessage button {
  width: 80px;
  height: 50px;
  background: #ff8400;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  border: none;
}
.orderMessage strong {
  font-size: 18px;
  color: #ff8400;
}
</style>

<style>
.el-drawer__header {
  margin-bottom: 10px;
}
.myDrawer .el-drawer__header {
  font-size: 24px;
  color: #ff8400;
}
.myDrawer .el-drawer__body {
  padding: 20px;
}
.myDrawer .el-table {
  font-size: 16px;
}
.payBtn {
  text-align: right;
  margin-top: 20px;
}
</style>