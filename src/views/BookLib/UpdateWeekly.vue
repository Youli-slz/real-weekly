<template>
  <div class="upweekly">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="是否隐藏">
        <el-switch on-color="#13ce66" off-color="#ff4949" v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item label="周刊标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="周刊周数">
        <el-date-picker v-model="form.weeks" type="date" placeholder="选择日期" ></el-date-picker>
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
        weeks: '',
        status: false
      }
    }
  },
  methods: {
    goback: function () {
      this.$router.push('/weekly');
    },
    onSubmint: function () {
      var self = this;
      var status = this.form.status == true? 0: 1;
      var weekid = Number.parseInt(this.$route.params.id);
      var zhouqishu = new Date(this.form.weeks).getTime() / 1000;
      if(this.form.title == '' || this.form.weeks == ''){
        this.$message("填写完整信息");
        return false;
      }
      else{
        this.axios.post(host.data, {
          action_name: 'update_weekly',
          data: {
            id: weekid,
            title: this.form.title,
            weeks: zhouqishu,
            status: status
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
      }
    },
    getsingle: function () {
      var self = this;
      var week_id = Number.parseInt(this.$route.params.id);
      this.axios.post(host.data, {
        action_name: "get_one_weekly",
        data: {
          weekly_id: week_id,
        },
      })
        .then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            self.form.title = data.data.title;
            self.form.weeks = data.data.weeks;
            self.form.status = data.data.status == 0? true: false;
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
