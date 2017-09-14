<template>
  <div class="commentlist">
    <el-button @click="showreply = true">回复</el-button>
    <el-table :data="comlist" border>
      <el-table-column label="评论id">
        <template scope="scope">
          {{ scope.row.comment_id }}
        </template>
      </el-table-column>

      <el-table-column label="头像">
        <template scope="scope">
          <img :src="scope.row.pic" width="50px;" height="50px;">
        </template>
      </el-table-column>

      <el-table-column label="昵称">
        <template scope="scope">
          {{ scope.row.nick_name }}
        </template>
      </el-table-column>

      <el-table-column label="评论内容" min-width="300px;">
        <template scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column label="评论时间">
        <template scope="scope">
          {{ formate(scope.row.create_at) }}
        </template>
      </el-table-column>

      <el-table-column label="作者回复">
        <template scope="scope">
          <div v-if="scope.row.comments == ''">
            <el-button @click="showreply = true, commentid = scope.row.comment_id">回复</el-button>
          </div>
          <div v-else>
            {{ scope.row.comments }}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="作者回复" :visible.sync="showreply">
      <el-input type="textarea" :rows="10" placeholder="回复内容" v-model="authorReply"></el-input>
      <div class="submit">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import host from '../../base.js'

export default {
  data() {
    return {
      comlist: [],
      showreply: false,
      authorReply: '',                   // 作者回复内容
      commentid: null                    // 评论id
    }
  },
  methods: {
    getlist: function () {              // 获取评论列表
      var self = this;

      var id = Number.parseInt(this.$route.params.id);

      this.axios.post(host.data,{
        action_name: 'get_comment_list',
          data: {
          dynamic_id: id,                //单个文章或电台的唯一ID
          page_no: 1,
          page_size: 100 
        }
      })
      .then(function (res){
        var data = res.data;
        if(data.code == 0) {
          self.comlist = data.data;
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
    onSubmit: function () {
      var self = this;
      if(this.authorReply == '') {
        this.$message("填写回复内容")
        return false ;
      } else {
        this.axios.post(host.data,{
          dynamic_id: id,
          content: self.authorReply,
          type: 2,
          parent_id: self.commentid
        })
        .then(function(res){
           console.log(res.data);
        })
      }
    }
  },
  created(){
    this.getlist();
  }
}
</script>

<style>
.commentlist{
  width: 100%;
  padding-bottom: 20px;
}
.submit{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
