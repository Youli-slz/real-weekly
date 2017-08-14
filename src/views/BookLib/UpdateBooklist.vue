<template>
  <div class="upweekly">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="是否隐藏">
        <el-switch on-value="0" off-value="1" on-color="#13ce66" off-color="#ff4949" v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item label="周刊标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmint">提交</el-button>
        <el-button @click="goback">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import host from '../../base.js'
export default {
  data() {
    return {
      form: {
        title: '',
        status: null
      }
    }
  },
  methods: {
    goback: function () {
      var weekid = Number.parseInt(this.$route.params.weekid);
      this.$router.push({name:'书籍列表', params:{id: weekid}});
    },
    onSubmint: function () {
      var self = this;
      var weekid = Number.parseInt(this.$route.params.id);
      this.axios.post(host.data, {
        action_name: 'update_book',
        data: {
          id: weekid,
          title: this.form.title,
          weeks: this.form.weeks,
          status: Number.parseInt(this.form.status)
        }
      })
        .then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            self.$message('更新成功');
            self.goback();
          }
          else {
            self.$message("更新失败");
            console.log(data.msg);
          }
        })
    },
    getsingle: function () {
      var self = this;
      var bookid = Number.parseInt(this.$route.params.bookid);
      this.axios.post(host.data, {
        action_name: "get_book",
        data: {
          book_id: bookid,
        },
      })
        .then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            self.form.title = data.data.title;
            self.form.weeks = data.data.weeks;
            self.form.status = data.data.status;
          }
          else {
            console.log(data.msg);
          }
        })
    }
  },
  created(){
    this.getsingle();
  }
}
</script>

<style>
.upweekly{
  width: 100%;
  padding: 20px;
}
</style>

