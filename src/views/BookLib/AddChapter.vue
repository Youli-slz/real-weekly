<template>
    <div class="chapter">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="章节标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
                <el-input v-model="form.url"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.description" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="图片">
                <div id="containerimg">
                    <label class="el-button el-button--primary el-button--small">
                        <i class="el-icon-upload"></i>
                        <span>点击上传图片</span>
                        <input type="file" id="img" style="display: none" />
                    </label>
                    <div>
                        <img :src="form.pic" alt="" width="100">
                    </div>
    
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmint">提交</el-button>
                <el-button @click="goback">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import host from '../../base.js';

export default {
    data() {
        return {
            form: {
                title: '',
                pic: '',
                url: '',
                description: ''
            }
        }
    },
    methods: {
        goback: function () {
            var book_id = Number.parseInt(this.$route.params.bookid);
            this.$router.push({ name: '章节列表', params: { id: book_id } });
        },
        onSubmint:function() {
            var self = this;
            var book_id = Number.parseInt(this.$route.params.bookid);
            this.axios.post(host.data,{
                action_name: 'create_article',
                data:{
                    book_id: book_id,
                    title: this.form.title,
                    pic: this.form.pic,
                    description: this.form.description,
                    url: this.form.url
                }
            })
            .then(function(res){
                var data = res.data;
                if(data.code == 0){
                    self.$message('创建成功');
                    self.goback();
                }
                else{
                    self.$message("创建失败");
                    console.log(data.msg);
                }
            })
        },
        uploadimg2: function () {
            var self = this;
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4', //上传模式,依次退化
                browse_button: 'img', //上传选择的点选按钮，**必需**
                uptoken: this.uptoken,
                //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                // uptoken : '<Your upload token>',
                //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                // unique_names: true,
                // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
                save_key: true,
                // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
                domain: 'https://oss.ririyuedu.com/',
                //bucket 域名，下载资源时用到，**必需**
                container: 'containerimg', //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '5mb', //最大文件体积限制
                flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
                max_retries: 3, //上传失败最大重试次数
                dragdrop: true, //开启可拖曳上传
                drop_element: 'containerimg', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', //分块上传时，每片的体积
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                filters: {
                    mime_types: [
                        { title: "Image files", extensions: "jpg,png,x-icon,gif,jpeg" } // 限定flv后缀上传格式上传
                    ]
                },
                multi_selection: false,
                init: {
                    'UploadProgress': function (up, files) {
                    },
                    'FileUploaded': function (up, file, info) {
                        var domain = up.getOption('domain');
                        var res = JSON.parse(info);
                        var urlImg = 'https://oss.ririyuedu.com/' + res.key;
                        console.log(self.linkorpic);
                        self.form.pic = urlImg;
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时，处理相关的事情
                        alert("上传出错，请刷新重新上传")
                    }
                }
            });
        },
        getuptoken: function () {
            var self = this;
            this.axios.get('http://wxmpx.gatao.cn/mypic/gettoken').then((response) => {
                var data = response.data;
                this.uptoken = data.token;
                self.uploadimg2();
            }, (response) => {
            });
        },
    },
    created() {
        this.getuptoken();
    }
}
</script>

<style>
.chapter {
    width: 100%;
    padding: 20px;
}
</style>