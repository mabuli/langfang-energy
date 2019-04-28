<template>
  <a-row class="pager-row">
    <a-col :span="24">
      <a-pagination
        layout="prev, pager, next"
        @current-change="goToPage"
        :total	="pageCount">
      </a-pagination>
    </a-col>
  </a-row>
</template>

<script>
  export default {
    name: 'WorkTablePager',
    props:{//pageSize:每页多少条 pageNum:当前页码 pageCount:共计多少页
      pageSize:{type:Number,default:10},
      pageNum:{type:Number,default:1},
      pageCount:{type:Number,default:1},
    },
    data() {
        return {}
    },
    methods: {
      goToPage:function(pageNum){
        console.log(this.pageCount);
        console.log(this.tableDataUrl);
        this.$emit('refreshData',pageNum);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
