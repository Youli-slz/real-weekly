<template>
    <div class="app-container">
        <div style="margin-bottom:20px;">
            <label>图片:</label>
        </div>
        <div id="containerimg" >
            <label class="el-button el-button--primary el-button--small">
                <i class="el-icon-upload"></i>
                <span>点击上传图片</span>
                <input type="file" id="img" style="display: none" />
            </label>
            <div style="margin-top:10px;">
                <img :src="picurl" alt="" width="100">
            </div>
        </div>
        <div style="margin-bottom:20px;">
            <label>图片类型</label>
        </div>
        <div style="margin-bottom:20px;">
            <el-select v-model="typeId" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div v-if="typeId != 3">
            <div style="margin-bottom:20px;">
                <label>图片标题:</label>
            </div>
            <div style="margin-bottom:20px;">
                <el-input type="text" v-model="description" style="width:600px;"></el-input>
            </div>
            <div style="margin-bottom:20px;">
                <label>跳转链接:</label>
            </div>
            <div style="margin-bottom:20px;">
                <el-input type="textarea" v-model="linkurl" style="width:600px;"></el-input>
            </div>
        </div>
        <div v-else>
            <div style="margin-bottom:20px;">
                <label>小程序类型</label>
            </div>
            <div style="margin-bottom:20px;">
                <el-select v-model="minatype" placeholder="请选择">
                    <el-option
                    v-for="item in type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="pagetypeid" placeholder="请选择">
                    <el-option
                    v-for="item in alist"
                    :key="item.dynamic_id"
                    :label="item.title"
                    :value="item.dynamic_id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div>
        <el-button type="primary" @click="onSubmit">立即提交</el-button>
        <el-button  @click="goback">返回</el-button>
      </div>  
    </div>
</template>

<script>
import host from '../../base.js'
export default {
    data() {
        return {
            picurl: '',
            linkurl: '',
            description: '',
            typeId: 1,
            minatype: 1,
            pagetypeid: null,
            options:[{
                value:1,
                label:"全局轮播图"
            },{
                value:2,
                label:"书籍轮播图"
            },{
                value: 3,
                label: "小程序轮播图"
            }],
            type:[{
                value: 1,
                label: '电台'
            },{
                value: 2,
                label: '文章'
            }],
            alist:[]
        }
    },
    watch:{
        minatype(value, oldval) {
            this.getlist();
        },
        typeId(value, oldval) {
            if(value == 3) {
                this.getlist();
            }
        }
    },
    methods: {
        goback:function(){
            this.$router.push('/carousels');
        },
        onSubmit:function() {
            var self = this;
            if(this.typeId != 3){
                this.axios.post(host.data,{
                    action_name: "create_carousels",
                    data: {
                        pic_url: this.picurl,
                        url: this.linkurl,
                        description: this.description,
                        type: this.typeId
                    }
                })
                .then(function(res){
                    var data = res.data;
                    if(data.code == 0){
                        self.$message("创建成功");
                        self.goback();
                    }
                    else{
                        self.$message("创建失败");
                        console.log(data.msg);
                    }
                })
            } else {
                this.axios.post(host.data,{
                    action_name: "create_carousels",
                    data: {
                        pic_url: this.picurl,
                        url: this.pagetypeid,
                        description: this.minatype.toString(),
                        type: this.typeId
                    }
                })
                .then(function(res){
                    var data = res.data;
                    if(data.code == 0){
                        self.$message("创建成功");
                        self.goback();
                    }
                    else{
                        self.$message("创建失败");
                        console.log(data.msg);
                    }
                })  
            }

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
                domain: 'http://7xld1x.com1.z0.glb.clouddn.com/',
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
                        var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
                        console.log(self.linkorpic);
                        self.picurl = urlImg;
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
            this.axios.get('http://wxmp.gatao.cn/mypic/gettoken').then((response) => {
                var data = response.data;
                self.uptoken = data.token;
                self.uploadimg2();
                console.log(self.uptoken);
            }, (response) => {
            });
        },
        getlist: function () {
            var self = this;
            this.axios.post(host.data,{
                action_name: "get_dynamic_list",
                data: {
                    type: this.minatype,
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
    },
    created() {
        this.getuptoken();
    }
}
</script>

<style>

</style>
