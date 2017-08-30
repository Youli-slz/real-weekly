<template>
  <div class="weekly">
    <div style="width: 400px;padding: 10px">
      <el-button type="primary" size="small" @click="showAdd = true" style="margin-bottom: 10px">创建周刊</el-button>
    </div>
    <template>
      <el-table :data="weeklist" v-loading.body="listLoading" border fit highlight-curretitnt-row style="width: 100%">
  
        <el-table-column align="center" label="序号" width="80">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="周期标题" width="200">
          <template scope="scope">
            <span>{{ scope.row.title}}</span>
          </template>
        </el-table-column>
  
        <el-table-column width="200" align="center" label="期数">
          <template scope="scope">
            <span>{{ scope.row.weeks }}</span>
          </template>
        </el-table-column>
  
        <el-table-column width="180" align="center" label="状态">
          <template scope="scope">
            {{ ishidden(scope.row.status) }}
          </template>
        </el-table-column>

        <el-table-column min-width="200" align="center" label="更新时间">
          <template scope="scope">
            <span>{{ scope.row.update_time }}</span>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template scope="scope">
            <el-button type="primary" @click='update(scope.row.id)' size="small" class="el-icon-edit">更新</el-button>
            <el-button type="primary" @click="gobooklist(scope.row.id)" size="small" class="el-icon-document">详情</el-button>
          </template>
        </el-table-column>
  
      </el-table>
    </template>
    <div style="margin-bottom: 40px">
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
    </div>

    <el-dialog title="新增周刊" v-model="showAdd">
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="4">
            <label>周刊标题:</label>
          </el-col>
          <el-col :span="20">
            <el-input type="text" v-model="newtitle"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom:20px;">
          <el-col :span="4">
            <label>周刊周数:</label>
          </el-col>
          <el-col :span="20">
            <!-- <el-input type="text" v-model="newweeks"  ></el-input> -->
            <el-date-picker v-model="newweeks" type="date" placeholder="选择日期" ></el-date-picker>
          </el-col>
        </el-row>
        <el-row type="flex"  justify="center" >
          <el-col :span="6"><el-button type="primary" @click="createweekly">确定</el-button></el-col>
          <el-col :span="6"><el-button type="primary" @click="cancel">取消</el-button></el-col>
        </el-row>
    </el-dialog>
  </div>
</template>

<script>
import host from '../../base.js'

export default {
  data() {
    return {
      weeklist: [],
      alllist: [],
      listLoading: false,
      currentPage: 1,
      pagesize: 100,
      totalpage: 1,
      showAdd: false,
      newtitle: '',
      newweeks: ''
    }
  },
  methods: {
    cancel:function(){
      this.showAdd = false;
      this.newtitle = '';
      this.newweeks = '';
    },
    update:function(val){
      this.$router.push({name: '更新周刊', params:{id: val}});
    },
    gobooklist: function(val) {
      this.$router.push({name: '书籍列表', params: {id: val}});
    },
    ishidden: function(val){
      return val==1 ? '显示' : '隐藏'
    },
    getweeklylist: function (val) {
      var self = this;
      this.listLoading = true;
      this.axios.post(host.data, {
        action_name: 'get_weekly',
        data: {
          page_no: val,
          page_size: 100
        }
      })
        .then(function (res) {
          var data = res.data;
          self.listLoading = false;
          self.weeklist = [];
          if (data.code == 0) {
            self.totalpage = data.data.count;
            self.weeklist = data.data.list;
          }
          console.log(self.weeklist);
        })
        .catch(function (err) {
          console.log(err);
          self.loading = false;
        })
    },
    handleCurrentChange: function (val) {
      console.log()
      this.getweeklylist(val);
    },
    createweekly: function(){
      var self = this;
      if(this.newtitle == '' || this.newweeks == ''){
        this.$message("请填写完整信息");
        return false;
      }
      else{
        var zhouqishu = new Date(this.newweeks).getTime() / 1000;
        this.axios.post(host.data,{
          action_name: 'create_weekly',
          data: {
            title: this.newtitle,
            weeks: zhouqishu
          }
        })
        .then(function(res){
          var data = res.data;
          if(data.code == 0){
            self.$message("创建成功");
            self.showAdd = false;
            self.getweeklylist(self.currentPage);
            self.newtitle = '';
            self.newweeks = '';
          }
          else{
            self.$message("创建失败");
            console.log(data.msg);
          }
        })
      }
    },
        fortime:function(t){
            var d = new Date(t*1000);
            var year = d.getFullYear();
            var day = d.getDate();
            var month = d.getMonth()+1;
            var hour = d.getHours();
            var minute = d.getMinutes();
            var f = year + "-" +this.initime(month) + "-" + this.initime(day);
            return f;
        },
        initime:function (num) { 
            return num > 0 ? (num + "") : ("0" + num); 
        },
  },
  created(){
    this.getweeklylist(this.currentPage);
    var time = Date.now() / 1000;
    this.newweeks = this.fortime(time);
  }
}
</script>

<style>
.weekly{
  width: 100%;
  padding: 20px;
}
</style>
