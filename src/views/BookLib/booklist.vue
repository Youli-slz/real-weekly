<template>
    <div class="booklist">
        <div style="width: 400px;padding: 10px">
            <el-button type="primary" size="small" @click="showAdd = true" style="margin-bottom: 10px">创建书籍</el-button>
            <el-button type="primary" size="small" @click="goback" style="margin-bottom: 10px;">返回</el-button>
        </div>
        <template>
            <el-table :data="Booklist" v-loading.body="listLoading" border fit highlight-curretitnt-row style="width: 100%">
    
                <el-table-column align="center" label="序号" width="80">
                    <template scope="scope">
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
    
                <el-table-column align="center" label="标题" width="300">
                    <template scope="scope">
                        <span>{{ scope.row.title}}</span>
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
    
                <el-table-column min-width="200px" align="center" label="创建时间">
                    <template scope="scope">
                        <span>{{ scope.row.create_time }}</span>
                    </template>
                </el-table-column>
    
                <el-table-column align="center" label="操作" width="200">
                    <template scope="scope">
                        <el-button type="primary" @click='update(scope.row.id)' size="small" class="el-icon-edit">更新</el-button>
                        <el-button type="primary" @click="gochapterlist(scope.row.id)" size="small" class="el-icon-document">详情</el-button>
                    </template>
                </el-table-column>
    
            </el-table>
        </template>
        <div style="margin-bottom: 40px">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
        </div>
    
        <el-dialog title="新增书籍" v-model="showAdd">
            <el-row :gutter="20" style="margin-bottom:20px;">
                <el-col :span="4">
                    <label>书籍标题:</label>
                </el-col>
                <el-col :span="20">
                    <el-input type="text" v-model="newtitle"></el-input>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col :span="6">
                    <el-button type="primary" @click="createBooks">确定</el-button>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="showAdd = false">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    
        <el-dialog title="更新书籍" v-model="showUpdate">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="是否隐藏">
                    <el-switch  on-color="#13ce66" off-color="#ff4949" v-model="form.status"></el-switch>
                </el-form-item>
                <el-form-item label="书籍标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="showUpdate = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import host from '../../base.js'

export default {
    data() {
        return {
            Booklist: [],
            alllist: [],
            listLoading: false,
            currentPage: 1,
            pagesize: 100,
            totalpage: 1,
            showAdd: false,
            newtitle: '',
            showUpdate: false,
            form: {
                title: '',
                status: null
            }
        }
    },
    methods: {
        goback:function(){
            this.$router.push('/weekly');
        },
        update: function (val) {
            var self = this;
            this.showUpdate = true;
            this.axios.post(host.data, {
                action_name: "get_book",
                data: {
                    book_id: val,
                },
            })
                .then(function (res) {
                    var data = res.data;
                    if (data.code == 0) {
                        self.form.title = data.data.title;
                        self.form.status = data.data.status == 0? true: false;
                    }
                    else {
                        console.log(data.msg);
                    }
                })
        },
        onSubmit:function(){
            var self = this;
            var status = this.form.status == true? 0 : 1;
            var weekid = Number.parseInt(this.$route.params.id);
            this.axios.post(host.data, {
                action_name: 'update_book',
                data: {
                id: weekid,
                title: this.form.title,
                status: status
                }
            })
                .then(function (res) {
                var data = res.data;
                if (data.code == 0) {
                    self.$message('更新成功');
                    self.showUpdate = false;
                    self.getbooklist(1);
                }
                else {
                    self.$message("更新失败");
                    console.log(data.msg);
                }
                })
        },
        gochapterlist: function (val) {
            var weekss = Number.parseInt(this.$route.params.id);
            this.$router.push({name: '章节列表',params:{id: val,weekid: weekss}});
        },
        ishidden: function (val) {
            return val == 1 ? '显示' : '隐藏'
        },
        getbooklist: function (val) {
            var self = this;
            var week_id = Number.parseInt(this.$route.params.id);
            this.listLoading = true;
            this.axios.post(host.data, {
                action_name: 'get_books',
                data: {
                    weekly_id: week_id,
                    page_no: val,
                    page_size: 100
                }
            })
                .then(function (res) {
                    var data = res.data;
                    self.listLoading = false;
                    self.Booklist = [];
                    if (data.code == 0) {
                        self.totalpage = data.count;
                        self.Booklist = data.data.list;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    self.listLoading = true;
                })
        },
        handleCurrentChange: function (val) {
            console.log()
            this.getbooklist(val);
        },
        createBooks: function () {
            var self = this;
            var week_id = Number.parseInt(this.$route.params.id);
            this.axios.post(host.data, {
                action_name: 'create_book',
                data: {
                    weekly_id: week_id,
                    title: this.newtitle
                }
            })
                .then(function (res) {
                    var data = res.data;
                    if (data.code == 0) {
                        self.$message("创建成功");
                        self.showAdd = false;
                        self.getbooklist(self.currentPage);
                    }
                    else {
                        self.$message("创建失败");
                        console.log(data.msg);
                    }
                })
        }
    },
    created() {
        this.getbooklist(this.currentPage);
    }
}
</script>

<style>
.booklist {
    width: 100%;
    padding: 20px;
}
</style>
