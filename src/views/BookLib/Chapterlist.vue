<template>
    <div class="chapterlist">
        <div style="width: 400px;padding: 10px">
            <el-button type="primary" size="small" @click="goAdd()" style="margin-bottom: 10px;">创建章节</el-button>
            <el-button type="primary" size="small" @click="goback()" style="magin-bottom: 10px;">返回</el-button>
        </div>
        <template>
            <el-table :data="Chapterlist" v-loading.body="listLoading" border fit highlight-curretitnt-row style="width: 100%">
    
                <el-table-column align="center" label="序号" width="80">
                    <template scope="scope">
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
    
                <el-table-column align="center" label="标题" width="200">
                    <template scope="scope">
                        <span>{{ scope.row.title}}</span>
                    </template>
                </el-table-column>
    
                <el-table-column align="center" label="图片" width="200">
                    <template scope="scope">
                        <img :src="scope.row.pic" width="150" />
                    </template>
                </el-table-column>

                <el-table-column width="180" align="center" label="详情">
                    <template scope="scope">
                        {{ scope.row.description }}
                    </template>
                </el-table-column>

                <el-table-column width="230" align="center" label="跳转链接">
                    <template scope="scope">
                        {{ scope.row.url }}
                    </template>
                </el-table-column>
    
                <el-table-column width="100" align="center" label="状态">
                    <template scope="scope">
                        {{ ishidden(scope.row.status) }}
                    </template>
                </el-table-column>
    
                <el-table-column min-width="200" align="center" label="更新时间">
                    <template scope="scope">
                        <span>{{ scope.row.update_time }}</span>
                    </template>
                </el-table-column>
    
                <el-table-column align="center" label="操作" width="100">
                    <template scope="scope">
                        <el-button type="primary" @click='update(scope.row.id)' size="small" class="el-icon-edit">更新</el-button>
                    </template>
                </el-table-column>
    
            </el-table>
        </template>
        <div style="margin-bottom: 40px">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
        </div>
    
    </div>
</template>

<script>
import host from '../../base.js'

export default {
    data() {
        return {
            Chapterlist: [],
            alllist: [],
            listLoading: false,
            currentPage: 1,
            pagesize: 100,
            totalpage: 1
        }
    },
    methods: {
        goback:function(){
            var weekid = Number.parseInt(this.$route.params.weekid);
            this.$router.push({name: '书籍列表', params:{id: weekid}});
        },
        update: function(val){
            var book_id = Number.parseInt(this.$route.params.id);
            this.$router.push({name: '更新章节',params:{articleid: val,bookid: book_id}});
        },
        goAdd: function () {
            var book_id = Number.parseInt(this.$route.params.id);
            this.$router.push({ name: '添加章节', params: { bookid: book_id } });
        },
        ishidden: function (val) {
            return val == 1 ? '显示' : '隐藏'
        },
        getchapterlist: function (val) {
            var self = this;
            var book_id = Number.parseInt(this.$route.params.id);
            this.listLoading = true;
            this.axios.post(host.data, {
                action_name: 'get_articles',
                data: {
                    book_id: book_id,
                    page_no: val,
                    page_size: 100
                }
            })
                .then(function (res) {
                    var data = res.data;
                    self.listLoading = false;
                    self.Chapterlist = [];
                    if (data.code == 0) {
                        self.totalpage = data.count;
                        self.Chapterlist = data.data.list;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    self.listLoading = true;
                })
        },
        handleCurrentChange: function (val) {
            console.log()
            this.getchapterlist(val);
        }
    },
    created() {
        this.getchapterlist(this.currentPage);
    }
}
</script>

<style>
.chapterlist {
    width: 100%;
    padding: 20px;
}
</style>

