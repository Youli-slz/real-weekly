<template>
    <div class="newgroup">
        <div class="header_name" style="margin-bottom:30px;">
            <h2>新增</h2>
            <div>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="goback">返回</el-button>
            </div>
        </div>
        <hr style="margin-bottom:30px;" />
        <el-form label-width="80px;" label-position="left">
            <el-form-item label="选择创建类型">
                <el-select v-model="type" placeholder="请选择">
                    <el-option v-for="item in carousList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="title" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="标题图片">
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
            <el-form-item>
                <el-input v-model="QR_Url" placeholder="图片url链接"></el-input>
            </el-form-item>
            <el-form-item label="美文内容" v-if="type == 2">
                <label>:</label>
                <UE :defaultMsg="defaultMsg" :config="config" ref="ue"></UE>
            </el-form-item>
            <el-form-item label="音频内容" v-if="type == 1">
                <label>:</label>
                <div id="container" style="margin-bottom: 20px;">
                    <label for="audio" class="el-button el-button--primary el-button--small">
                        <i class="el-icon-upload"></i>
                        <span>点击上传语音</span>
                    </label>
                    <div>
                        <audio :src="radiocontent" controls id="content">
                            您的浏览器不支持 audio 标签.
                        </audio>
                    </div>
                    <input type="file" id="audio" style="display: none;" />
                </div>
                <div style="margin-bottom:20px;">
                    <el-input type="text" v-model="radiocontent" id="content" placeholder="复制语音链接"></el-input>
                </div>

            </el-form-item>
        </el-form>
        <!-- <div class="operation">

        </div> -->
    </div>
</template>

<script>
import host from '../../base.js'
import UE from '../../components/UEditor/index.vue'

export default {
    components: { UE },
    data() {
        return {
            groupName: '',
            QR_Url: '',
            uptoken: '',
            type: 1,
            carousList: [{
                value: 1,
                label: '电台'
            }, {
                value: 2,
                label: '美文'
            }],
            title: '',               // 新创电台或者美文的标题
            content: '',             // 美文内容
            radiocontent: '',        // 音频内容
            defaultMsg: '',
            config: {
                initialFrameWidth: null,
                initialFrameHeight: 350
            }
        }
    },
    methods: {
        onSubmit: function() {
            var self = this;
            if (self.type == 1) {
                self.content = '';
            } else {
                self.radiocontent = '';
                self.content = this.$refs.ue.getUEContent();
                this.$notify({
                    title: '获取成功',
                    message: this.content,
                    type: 'success'
                });
            }
            if (this.title == '' || this.QR_Url == '') {
                this.$message("请填写完整信息");
            } else {
                this.axios.post(host.data, {
                    action_name: "add_dynamic",
                    data: {
                        title: self.title,
                        pic: self.QR_Url,
                        content: self.content,
                        type: Number.parseInt(self.type),
                        voice: self.radiocontent
                    }
                })
                    .then(function(res) {
                        var data = res.data;
                        if (data.code == 0) {
                            self.$message("创建成功");
                            self.goback();
                        } else {
                            self.$message("创建失败");
                        }
                    })
                    .catch(function(res) {
                        console.log(res);
                    })
            }
        },
        goback: function() {
            this.$router.push("/articleORradiolist");
        },
        getuptoken: function() {
            var self = this;
            this.axios.get('http://wxmpx.gatao.cn/mypic/gettoken').then((response) => {
                var data = response.data;
                self.uptoken = data.token;
                self.uploadimg2();
                self.uploadaudio();
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
        uploadaudio: function() {
            var self = this;
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4', //上传模式,依次退化
                browse_button: 'audio', //上传选择的点选按钮，**必需**
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
                container: 'container', //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '10mb', //最大文件体积限制
                flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
                max_retries: 3, //上传失败最大重试次数
                dragdrop: true, //开启可拖曳上传
                drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', //分块上传时，每片的体积
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                filters: {
                    mime_types: [
                        { title: "Audio files", extensions: "mp3" } // 限定flv后缀上传格式上传
                    ]
                },
                multi_selection: false,
                init: {
                    UploadProgress: function(up, file) {
                    },
                    'FileUploaded': function(up, file, info) {
                        var domain = up.getOption('domain');
                        var res = JSON.parse(info);
                        var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
                        self.radiocontent = urlImg;
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时，处理相关的事情
                        console.log(err);
                        alert("上传出错，请刷新重新上传")
                    }
                }
            });
        },
        confirm: function() {
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


.header_name {
    display: flex;
    margin-bottom: 30px;
    justify-content: space-between;
    align-items: flex-end;
}
</style>

