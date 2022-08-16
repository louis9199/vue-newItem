<template>
  <el-dialog
    title="菜品信息"
    :visible.sync="dialogVisible"
    top="15vh"
    :before-close="handleClose"
  >
    <el-form :model="curdish" :rules="rules" ref="form" label-width="auto">
      <el-form-item label="菜名" prop="name">
        <el-input v-model="curdish.name"></el-input>
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input v-model.number="curdish.price"></el-input>
      </el-form-item>

      <el-form-item label="简介" prop="desc">
        <el-input type="textarea" rows="5" v-model="curdish.desc"></el-input>
      </el-form-item>

      <el-form-item label="推荐指数">
        <el-rate v-model="curdish.stars"></el-rate>
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-switch
          v-model="curdish.recommend"
          active-color="#ff8400"
          inactive-color="#ccc"
          >></el-switch
        >
      </el-form-item>

      <el-form-item label="图片">
        <el-upload
          class="avatar-uploader"
          action="http://order-api.chenxuehui.com/auth/upload_img"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :before-upload="beforeUpload"
          name="image"
        >
          <img
            v-if="curdish.image"
            :src="'http://order-api.chenxuehui.com/' + curdish.image"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: Boolean,
    curdish: Object
  },
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: '请输入菜名',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '价格',
            type: 'number',
            trigger: 'blur'
          }
        ],
        desc: [
          {
            required: true,
            message: '请输入简介',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog')
      this.$refs['form'].resetFields() //移除表单验证
    },
    beforeUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或png ,webp格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2M!')
      }
      return isJPG && isLt2M
    },
    uploadSuccess(res) {
      //console.log(res)
      //this.curdish.image = res.url子组件不能去修改父组件的数据
      this.$emit('changeImage', res.url)
    },
    submitForm() {
      //先验证再请求
      this.$refs['form']
        .validate()
        .then(() => {
          this.$fetch({
            url: '/api/edit_dish',
            method: 'POST',
            data: this.curdish
          }).then(() => this.handleClose())
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>