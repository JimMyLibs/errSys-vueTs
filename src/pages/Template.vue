<template>
    <div class="pages_template">
        <h1>{{ pageName }}</h1>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

@Component({
    components: {
        
    }
})
export default class Pages_template extends Mixins(VueMixin) {
    pageName: string = "pages_template";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_template {
    
}
</style>
