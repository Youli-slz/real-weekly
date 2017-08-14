<template>
    <div class="app-container calendar-list-container">
        <div style="width: 400px;padding: 10px">
            <el-button type="primary" size="small" @click="goAdd()" style="margin-bottom: 10px">添加轮播图</el-button>
        </div>
        <template>
            <el-table :data="carouselist" v-loading.body="listLoading" border fit highlight-current-row  style="width: 100%">
    
                <el-table-column align="center" label="序号" width="80">
                    <template scope="scope">
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
    
                <el-table-column  align="center" label="图片" width="300">
                    <template scope="scope">
                        <img :src="scope.row.pic_url" width="150" />
                    </template>
                </el-table-column>
    
                <el-table-column width="200" align="center" label="跳转链接">
                    <template scope="scope">
                        <span>{{ scope.row.url }}</span>
                    </template>
                </el-table-column>
    
                <el-table-column width="180" align="center" label="状态">
                    <template scope="scope"> 
                        {{ scope.row.ishidden }}
                    </template>
                </el-table-column>
    
                <el-table-column min-width="200" align="center" label="更新时间">
                    <template scope="scope">
                        <span>{{ scope.row.update_time }}</span>
                    </template>
                </el-table-column>
    
                <el-table-column min-width="200px" align="center" label="创建时间">
                    <template scope="scope">
                        <span>{{ scope.row.create_time }}</span>
                    </template>
                </el-table-column>
    
                <el-table-column align="center" label="操作" width="200">
                    <template scope="scope">
                            <el-button type="primary" @click='update(scope.row.id)' size="small" class="el-icon-edit">更新</el-button>
                            <el-button type="primary" @click='confirm(scope.row.id)' size="small" icon="close">删除</el-button>
                    </template>
                </el-table-column>
    
            </el-table>
        </template>
        <div style="margin-bottom: 40px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
        </div>
    </div>
</template>

<script>
import host from '../../base.js'
export default {
    data() {
        return {
            carouselist: [],
            alllist: [],
            listLoading: false,
            pagesize: 100,
            totalpage: 1,
            currentPage: 1
        }
    },
    methods: {
        getcarlist: function () {
            var self = this;
            this.listLoading = true;
            this.axios.post(host.data, {
                action_name: "get_carousels",
                data: "get_carousels"
            })
                .then(function (res) {
                    var data = res.data
                    self.listLoading = false;
                    self.carouselist = [];
                    if (data.code == 0) {
                        self.alllist = data.data;
                        if (self.alllist == null) {
                            self.carouselist = [];
                        }
                        else {
                            for(var i = 0; i < self.alllist.length; i++){
                                if(self.alllist[i].status == 1){
                                    self.$set(self.alllist[i], 'ishidden', '正常');
                                }
                                else{
                                    self.$set(self.alllist[i], 'ishidden', '禁用');
                                }
                            }
                            self.totalpage = self.alllist.length;
                            var currentSize = self.currentPage * self.pagesize;
                            if (currentSize > self.alllist.length) {
                                currentSize = self.alllist.length;
                            }
                            for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
                                self.carouselist.push(self.alllist[i]);
                            }
                        }
                    }
                    else {
                        console.log(data.msg);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    self.listLoading = false;
                })
        },
        handleSizeChange: function () {
            var self = this
            self.carouselist = []
            var j = self.currentPage == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize
            for (var i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
                self.carouselist.push(self.alllist[i])
            }
        },
        handleCurrentChange: function (val) {
            var self = this
            self.carouselist = []
            self.currentPage = val
            var j = val == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize
            for (var i = (val - 1) * self.pagesize; i < j; i++) {
                self.carouselist.push(self.alllist[i])
            }
        },
        goAdd: function () {
            this.$router.push('/addcarousels');
            // console.log(host);
            // this.haha = host.data;
        },
        update:function(val){
            // this.$router.push('/updatecarousels?id='+val);
            this.$router.push({name:'更新轮播图',params:{id: val}});
        },
        confirm(val) {
            var self = this
            this.$confirm('是否删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.delet(val)
            }).catch(() => {
            });
        },
        delet: function (val) {                               /// 删除书本的函数
            var self = this;
            console.log(val);
            this.axios.post(host.data, {
                action_name:  "delete_carousels",
                data: {
                    id: val
                }
            })   // 需要添加删除的后台url
                .then(function (res) {
                    var data = res.data
                    if (data.code === 0) {
                        self.$message('删除成功');
                        self.getcarlist();
                    }
                    else {
                        self.$message('删除失败');
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    self.$message('删除失败');
                })
        },
    },
    created(){
        this.getcarlist();
    }
}
</script>

<style>
.app-container{
    width:100%;
    padding: 20px;
}
</style>
