<template>
    <div class="bookgroup">
        <div class="operation">
            <el-button type="primary" @click="goadd">新增分组</el-button>
        </div>
        <div class="group_list">
            <template>
                <el-table :data="grouplist" v-loading.body="listloading" height border style="width: 100%">
                    <el-table-column align="center" label="组名">
                        <template scope="scope">
                            <span>{{ scope.row.title }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="二维码">
                        <template scope="scope">
                            <img :src="scope.row.qrcode_url" width="130px;" height="180px;" />
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="轮播图">
                        <template scope="scope">
                            <el-button type="text" @click="showpic(scope.row.carousel)">查看</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作">
                        <template scope="scope">
                            <el-button type="primary" @click="Update(scope.row.id)">修改</el-button>
                            <el-button type="primary" @click="confirm(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-dialog title="轮播图卡片" v-model="showPic">
            <el-carousel  type="card" height="300px" style="margin-left:50px;">
                <el-carousel-item v-for="item in carouslist" :key="item">
                    <img :src="item" width="367px;" height="300px;">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>

<script>
import host from '../../base.js'

export default {
    data() {
        return {
            grouplist: [],
            listloading: false,
            showPic: false,
            carouslist: [],
            carousls:[]
        }
    },
    methods: {
        showpic: function(val) {
            var self = this;
            self.carouslist = [];
            for(var i = 0; i < val.length; i++){
                self.carouslist.push(val[i]);
            }
            this.showPic = true;
        },
        goadd: function() {
            this.$router.push('/addgroup');
        },
        confirm: function(val) {
            var self = this;
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonTex: '取消',
                type: 'warning'
            }).then(() => {
                self.delet(val);
            }).catch(() => {
            });
        },
        delet: function(val) {
            var self = this;
            this.axios.post(host.data, {
                action_name: "del_article_params",
                data:{
                    id: val
                }
            })
            .then(function(res){
                var data = res.data;
                if(data.code == 0){
                    self.$message("删除成功");
                    self.getlist();
                } else {
                    self.$message("删除失败");
                }
            }).catch(function (err) {
                console.log(err);
                self.$message("删除失败");
            })
        },
        Update: function(val) {
            this.$router.push({name: '更新分组配置', params:{id: val}});
        },
        getlist: function () {
            var self = this;
            self.listloading = true;
            this.axios.post(host.data,{
                action_name: "get_article_params_list",
                data: "get_article_params_list"
            })
            .then(function (res){
                var data = res.data;
                if(data.code == 0){
                    self.listloading = false;
                    self.grouplist = data.data;
                } else {
                    self.$message("获取失败");
                }
            })
        }
    },
    created(){
        this.getlist();
    }
}
</script>

<style>
.bookgroup {
    width: 100%;
}

.operation {
    margin-bottom: 10px;
}

hr {
    color: black;
}

.group_list {
    margin-top: 10px;
}
</style>
