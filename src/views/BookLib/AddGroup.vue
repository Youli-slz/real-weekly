<template>
    <div class="newgroup">
        <div style="margin-bottom:30px;">
            <h2>新增分组</h2>
        </div>
        <hr style="margin-bottom:30px;" />
        <el-form label-width="80px;" label-position="left">
            <el-form-item label="分组名称">
                <el-input v-model="groupName" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="二维码">
                <div id="containerimg">
                    <div class="upload-img">
                        <i class="el-icon-plus for_pic"></i>
                        <input type="file" id="img" style="width:100%;height:100%; opacity: 0;" />
                    </div>
                    <div id="my-mask" class="mask-wrapper" v-if="QR_Url != ''">
                        <img :src="QR_Url" width="100%" height="100%" style="border-radius:5px;" />
                        <div class="mask-inner">
                            <i class="el-icon-delete2" style="color:#ffffff;padding-top:47%;padding-left:47%;width:100px;" @click="confirm"></i>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="选择轮播图">
                <el-select v-model="carousels" filterable multiple clearable placeholder="请选择">
                    <el-option v-for="item in carousList" :key="item.id" :label="item.description == ''? item.id : item.description" :value="item.id" :disabled="item.status == 1? false: true">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="operation">
            <el-button type="primary" @click="onSubmint">提交</el-button>
            <el-button @click="goback">返回</el-button>
        </div>
    </div>
</template>

<script>
import host from '../../base.js'

export default {
    data() {
        return {
            groupName: '',
            QR_Url: '',
            uptoken: '',
            carousels: [],
            carousList: []
        }
    },
    methods: {
        onSubmint: function () {
            var self = this;
            if( this.groupName == '' ){
                this.$message('请填写完整信息');
                return false;
            } else {
                this.axios.post(host.data, {
                    action_name: 'create_article_params',
                    data: {
                        title: self.groupName,
                        qrcode_url: self.QR_Url,
                        carousel: self.carousels
                    }
                })
                .then(function(res){
                    var data = res.data;
                    if(data.code == 0){
                        self.$message('创建成功');
                        self.goback();
                    } else {
                        self.$message('创建失败');
                        console.log(data.msg);
                    }
                })
            }
        },
        goback: function() {
            this.$router.push("/bookgroup")
        },
        getuptoken: function() {
            var self = this;
            this.axios.get('http://wxmpx.gatao.cn/mypic/gettoken').then((response) => {
                var data = response.data;
                self.uptoken = data.token;
                self.uploadimg2();
                console.log(self.QR_Url);
                console.log(self.uptoken);
            }, (response) => {
            });
        },
        uploadimg2: function() {
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
                    'UploadProgress': function(up, files) {
                    },
                    'FileUploaded': function(up, file, info) {
                        var domain = up.getOption('domain');
                        var res = JSON.parse(info);
                        var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
                        console.log(self.linkorpic);
                        self.QR_Url = urlImg;
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时，处理相关的事情
                        alert("上传出错，请刷新重新上传")
                    }
                }
            });
        },
        getcarlist: function() {
            var self = this;
            this.axios.post(host.data, {
                action_name: "get_carousels",
                data: "get_carousels"
            })
                .then(function(res) {
                    var data = res.data;
                    if (data.code == 0) {
                        self.carousList = data.data;
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
            console.log(self.carousList)
        },
        confirm: function () {
            var self = this;
            this.$confirm("是否删除？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.QR_Url = '';
            }).catch(() => {                
            });
        }
    },
    created() {
        this.getuptoken();
        this.getcarlist();
    }
}
</script>

<style>
#containerimg {
    display: flex;
    flex-direction: row;
    position: relative;
    left: 15px;
}

.upload-img {
    border: 1px dashed #c0ccda;
    width: 150px;
    height: 150px;
    border-radius: 5px;
    background-color: #fbfdff;
}

.operation {
    margin-top: 50px;
}

.newgroup {
    width: 100%;
}

.for_pic {
    position: fixed;
    padding-left: 68px;
    padding-top: 69px;
    color: #c0ccda;
}

.mask-wrapper {
    position: relative;
    overflow: hidden;
}

.mask-inner {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    height: 100%;
    -moz-transition: top ease 200ms;
    -o-transition: top ease 200ms;
    -webkit-transition: top ease 200ms;
    transition: top ease 200ms;
}

.mask-wrapper:hover .mask-inner {
    top: 0;
}

#my-mask {
    border: 1px dashed #c0ccda;
    width: 150px;
    height: 150px;
    border-radius: 5px;
    margin-left: 20px;
    background-color: #fbfdff;
}

#my-mask .mask-inner {
    background: rgba(0, 0, 0, .5);
}
</style>
