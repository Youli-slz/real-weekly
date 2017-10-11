<template>
  <div class="article_list">
       <div class="page_header">
          <label>类别</label>
          <el-select v-model="type">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
          <el-button type="primary" @click="add()">创 建</el-button>
      </div>
      <div class="page_list">
          <el-table :data="alist"  border style="width: 100%;">
            <el-table-column label="id" width="80" align="center">
               <template scope="scope">
                   {{ scope.row.dynamic_id }}
               </template>
            </el-table-column>

            <el-table-column label="标题" align="center">
               <template scope="scope">
                   {{ scope.row.title }}
               </template>
            </el-table-column>

            <el-table-column label="标题图片" align="center">
               <template scope="scope">
                   {{ scope.row.pic }}
               </template>
            </el-table-column>

            <el-table-column label="浏览数" width="80" align="center">
               <template scope="scope">
                   {{ scope.row.count }}
               </template>
            </el-table-column>

            <el-table-column label="评论数" width="80" align="center">
               <template scope="scope">
                   {{ scope.row.comment_count }}
               </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center">
               <template scope="scope">
                   {{ formate(scope.row.create_at) }}
               </template>
            </el-table-column>

            <el-table-column label="操作" min-width="80" align="center">
               <template scope="scope">
                   <el-button type="primary" size="small" :disabled="true">更新</el-button>
                   <el-button size="small" @click="confirm(scope.row.dynamic_id)">删除</el-button>
                   <el-button size="small" type="primary" @click="gocomment(scope.row.dynamic_id)">评论</el-button>
               </template>
            </el-table-column>
          </el-table>
      </div> 
  </div>
</template>

<script>
import host from '../../base.js'

export default {
    data(){
        return {
           alist: [],
           type: 1,
           options:[{
               value: 1,
               label: '电台'
           },{
               value: 2,
               label:'美文'
           }]
        }
    },
    watch: {
        type(value, oldval) {
            this.getlist();
            console.log(this.type);
        }
    },
    methods:{
        confirm: function (val){
            var self = this;
            this.$confirm('是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               self.delet(val);
            })
        },
        delet: function (val) {
            var self = this;
            this.axios.post(host.data,{
                action_name: "del_dynamic",
                data: {
                    dynamic_id: val
                }
            })
            .then(function(res){
                var data = res.data;
                if(data.code == 0) {
                    self.$message("删除成功");
                    self.getlist();
                } else {
                    self.$message("删除失败");
                }
            })
            .catch(function (res){
                console.log(res);
                self.$message("删除失败");
            })
        },
        gocomment: function (val) {
            this.$router.push({name: '评论页面', params: {id: Number.parseInt(val)}});
        },
        add: function () {
            this.$router.push('/addarticleorradio')
        },
        getlist: function () {
            var self = this;
            this.axios.post(host.data,{
                action_name: "get_dynamic_list",
                data: {
                    type: this.type,
                    page_no: 1,
                    page_size: 10
                }
            })
            .then(function(res){
                var data = res.data;
                console.log(data);
                if(data.code == 0) {
                    self.alist = data.data;
                    console.log(self.alist);
                }
            })
        },
        formate: function(t) {                   // 时间戳格式化
            var d = new Date(t * 1000);
            var year = d.getFullYear();
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var hour = d.getHours();
            var minute = d.getMinutes();
            var f = year + "-" + this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
            return f;
        },
        init: function(d) {
            return d > 9 ? d : "0" + d;
        },
    },
    created(){
        this.getlist();
    }
}
</script>

<style>
.article_list{
    width: 100%;
}
.page_header{
    margin-bottom: 20px;
}
.page_list{
     /* margin-bottom:100px;  */
}
</style>
