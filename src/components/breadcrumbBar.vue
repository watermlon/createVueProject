<template>
<div>
    <Breadcrumb>
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem v-for="(item,index) in path">{{item}}</BreadcrumbItem>
    </Breadcrumb>
</div>
</template>
<script>
export default {
    data(){
        return {
            path:[]
        }
    },
    watch:{
        $route(){
            this.init()
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            const routeInfo = this.$route
            this.path = routeInfo.meta.breadcrumb
        }
    }
}
</script>
<style scoped lang='less'>

</style>