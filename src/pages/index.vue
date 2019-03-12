<template>
    <div class="pages_index bg_fff">
        <div class="index_hd">
            <label for="projectName">项目名称：</label>
            <input id="projectName" type="text" v-model="findForm.projectName">
            <label for="phone">手机号：</label>
            <input id="phone" type="text" v-model="findForm.phone">
            <label for="dateTime">日期：</label>
            <input id="dateTime" type="dateTime" v-model="findForm.date">
            <label for="errMsg">错误信息：</label>
            <input id="errMsg" type="text" v-model="findForm.errMsg">
            <button class="btn" @click="getLogs">查询</button>
            <button class="btn mg_l_20" @click="setLogs">保存</button>
        </div>
        <div class="index_bd pd_10">
            <table class="logs_table text-center" border>
                <thead>
                    <tr>
                        <th style="width: 0.6rem;">序号</th>
                        <!-- <th style="width: 0.9rem;">项目名称</th> -->
                        <!-- <th style="width: 0.7rem;">手机号</th> -->
                        <th style="width: 1.6rem;">时间</th>
                        <th style="width: 1.6rem;">系统</th>
                        <th style="width: 1.6rem;">浏览器</th>
                        <th>错误信息</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in logs" :key="index">
                        <td>{{index+1}}</td>
                        <!-- <td>{{item.projectName}}</td> -->
                        <!-- <td>{{item.phone}}</td> -->
                        <td>{{item.dateTime | dateFormat}}</td>
                        <td>{{item.os}}{{item.os_version}}</td>
                        <td>{{item.browser}}{{item.browser_version}}</td>
                        <td>{{item.errMsg}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import {getBrowserInfo, getOs} from '../resource/js/env'
const {os, version: os_version} = getOs()
const {browser, version: browser_version} = getBrowserInfo()

@Component({
    components: {},
    filters: {
        dateFormat(value: string | number, fmt = 'yyyy-MM-dd hh:ss') {
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
        }
    }
})
export default class Pages_index extends Mixins() {
    pageName: string = "pages_index";
    findForm = {
        phone: "13000000001",
        date: "",
        projectName: "",
        errMsg: ""
    };
    logs = [];
    getLogs(): void {
        this.logs = [];
        fetch("http://172.21.0.21:3101/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                data: {
                    ...this.findForm
                }
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
            this.logs = data.data.logs;
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
                data: {
                    ...this.findForm,
                    os, os_version,browser, browser_version
                }
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
