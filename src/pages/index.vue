<template>
    <div class="pages_index bg_fff">
        <div class="index_hd">
            <label for="project_id">项目名称：</label>
            <input id="project_id" type="text" v-model="findForm.project_id">
            <label for="project_id">事件名称：</label>
            <input id="project_id" type="text" v-model="findForm.event_id">
            <label for="phone">手机号：</label>
            <input id="phone" type="text" v-model="findForm.phone">
            <label for="time">日期：</label>
            <input id="time" type="date" v-model="findForm.time">
            <label for="remark">备注信息：</label>
            <input id="remark" type="text" v-model="findForm.remark">
        </div>
        <div class="submit mg_t_20 text-center">
            <button class="btn" @click="getLogs">查询</button>
            <button class="btn mg_l_20" @click="setLogs">保存</button>
        </div>
        <div class="index_bd">
            <table class="logs_table text-center" border>
                <thead>
                    <tr>
                        <th style="width: 0.6rem;">序号</th>
                        <th>项目名称</th>
                        <th>事件名称</th>
                        <th>渠道</th>
                        <th style="width: 1.8rem;">时间</th>
                        <th style="width: 1.6rem;">系统</th>
                        <th style="width: 1.6rem;">浏览器</th>
                        <th>备注信息</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in logs" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{item.project_id}}</td>
                        <td :class="{'f_red':item.event_id.includes('耗时')}">{{item.event_id}}</td>
                        <td>{{item.channel}}</td>
                        <td :class="{'f_red':item.event_id.includes('耗时')}">{{item.time | dateFormat}}</td>
                        <td>{{item.os}}{{item.os_version}}</td>
                        <td>{{item.browser_brand}}{{item.browser_version}}</td>
                        <td>{{item.remark}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="index_ft">
            <a class="btn" :href="downloadLogs">下载日志</a>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import {getBrowserInfo, getOs} from '../resource/js/env'
const {os, version: os_version} = getOs()
const {browser:browser_brand, version:browser_version} = getBrowserInfo()

@Component({
    components: {},
    filters: {
        dateFormat(value: string | number, fmt = 'yyyy-MM-dd hh:ss S') {
            if(value.toString().includes('-')){
                const date: Date = new Date(value);
                let o: any = {
                    "M+": date.getMonth() + 1, //月份 
                    "d+": date.getDate(), //日 
                    "w+" : date.getDay(), //week
                    "h+": date.getHours(), //小时 
                    "m+": date.getMinutes(), //分 
                    "s+": date.getSeconds(), //秒 
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                    "S": date.getMilliseconds() //毫秒 
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }else{
                return value/1000 + ' s';
            }
        }
    }
})
export default class Pages_index extends Mixins() {
    pageName: string = "pages_index";
    findForm = {
        phone: "13066847550",
        time: "",
        project_id: "",
        event_id: "",
        remark: ""
    };
    logs = [];
    get downloadLogs(): string {
        return '';
    }
    mounted(): void {
        this.getLogs();
    }
    getLogs(): void {
        this.logs = [];
        fetch("http://172.21.0.21:3101/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                ...this.findForm
            })
        }).then(data => {
            // in some SAMSUNG mobile data.ok is undefined so add data.status
            if (data.ok || data.status === 200) {
                return data.json();
            } else {
                // 未正常返回数据，则抛出异常
                throw new Error(`响应数据异常，错误码：${data.status}`);
            }
        })
        .then(data => {
            let tmpLogs = [];
            data.data.logs.reduce((pre,item,index,arr)=>{
                tmpLogs.push(item);
                if(pre.project_id == item.project_id && pre.event_id == item.event_id && item.event_id.includes('_time')){// 同一个项目同一个事件，计算耗时
                    let nextObj = JSON.parse(JSON.stringify(item));
                    nextObj.time = new Date(item.time).getTime() - new Date(pre.time).getTime();
                    nextObj.event_id = item.event_id.split('_time')[0] + ': 耗时'
                    nextObj.remark = '耗时';
                    tmpLogs.push(nextObj);
                }
                return item;
            },{})
            this.logs = tmpLogs;
            return data;
        })
        .catch(function(e) {
            console.log("fetch fail", JSON.stringify(e));
        });
    }
    setLogs(): void {
        fetch("http://172.21.0.21:3101/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                ...this.findForm,
                os, os_version,browser_brand, browser_version,
                time: Date.now()
            })
        }).then(data => {
            // in some SAMSUNG mobile data.ok is undefined so add data.status
            if (data.ok || data.status === 200) {
                return data.json();
            } else {
                // 未正常返回数据，则抛出异常
                throw new Error(`响应数据异常，错误码：${data.status}`);
            }
        })
        .then(data => {
            console.log('保存成功');
        })
        .catch(function(e) {
            console.log("fetch fail", JSON.stringify(e));
        });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_index {
    padding: 0.1rem;
    font-size: 0.16rem;
    .index_hd {
        input {
            margin-right: 0.2rem;
        }
    }
    .index_bd {
        min-height: 60vh;
        padding: 0.2rem 0;
        .logs_table {
            font-size: 0.16rem;
            tr {
                vertical-align: top;
                th {
                    padding: 0.05rem 0.1rem;
                }
                td {
                    padding: 0rem 0.1rem;
                }
            }
        }
    }
}
</style>
