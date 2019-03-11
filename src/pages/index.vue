<template>
    <div class="pages_index bg_fff">
        <div class="index_hd">
            <label for="projectName">项目名称：</label>
            <input id="projectName" type="text" v-model="findForm.projectName">
            <label for="phone">手机号：</label>
            <input id="phone" type="text" v-model="findForm.phone">
            <label for="date">日期：</label>
            <input id="date" type="date" v-model="findForm.date">
            <label for="errMsg">错误信息：</label>
            <input id="errMsg" type="text" v-model="findForm.errMsg">
            <button class="btn" @click="getLogs">查询</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";

@Component({
    components: {}
})
export default class Pages_index extends Mixins() {
    pageName: string = "pages_index";
    findForm = {
        phone: "13000000001",
        date: "",
        projectName: "",
        errMsg: ""
    };
    logs = {};
    getLogs(): void {
        fetch("http://172.21.0.21:3101/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data:this.findForm})
        })
            .then(data => {
                // in some SAMSUNG mobile data.ok is undefined so add data.status
                if (data.ok || data.status === 200) {
                    return data.json();
                } else {
                    // 未正常返回数据，则抛出异常
                    throw new Error(`响应数据异常，错误码：${data.status}`);
                }
            })
            .then(data => {
                return data;
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
}
</style>
