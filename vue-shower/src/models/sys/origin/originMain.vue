<template>
  <WorkMain :headerItems="['权限管理','机构管理']">

    <a-row class="table-row">
      <a-col :span="24">
        <a-table
          :dataSource="originDataList"
          :pagination="pager"
          @change="getTableData"
          :loading="loading"
          rowKey="origin_id"
          style="width: 100%">
          <a-table-column
            dataIndex="origin_id"
            align="left"
            title="机构编号">
          </a-table-column>
          <a-table-column
            dataIndex="origin_name"
            align="left"
            title="机构名称">
          </a-table-column>
          <a-table-column
            dataIndex="parent_origin_id"
            align="left"
            title="上级机构编号">
          </a-table-column>
          <a-table-column
            dataIndex="parent_origin_name"
            align="left"
            title="上级机构名称"
            :formatter="formatterSuperName"
          >
          </a-table-column>

        </a-table>
      </a-col>
    </a-row>
  </WorkMain>
</template>

<script>
  import WorkMain from "@/models/public/WorkMain"
  import { required } from 'vuelidate/lib/validators'
  import "@/styles/table-page.scss"
  export default {
    name: 'OriginMain',
    data() {
      return {
        originDataList:[],
        originDataObjs:{},
        tableDataUrl:'origin/listOrigin',
        pager: {
          pageSizeOptions: ['10', '50', '100', '200'],
          current: 1,
          total:1,
          pageSize: 10,
          showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
        },
        loading:false,
        isEditModal:false
      }
    },
    validations:{
      formData:{
        super_module_id:{
          required
        },
        module_name:{
          required
        }
      }
    },
    computed:{
      formData:function(){
        if(this.isEditModal){
          return this.editFormData
        }else{
          return this.addFormData
        }
      }
    },
    components: {
      WorkMain
    },
    methods: {
      getQueryParm(pageNum, query = {}){
        let params = Object.assign({}, query)
        if(pageNum == null || pageNum == '')
          pageNum = this.pager.current
        else if(typeof(pageNum)=='object'){
          this.pager = pageNum
        }
        params.currPage = this.pager.current
        params.pageSize = this.pager.pageSize
        return params
      },
      getTableData(pageNum){
        const $this = this
        let params = $this.getQueryParm(pageNum)
        $this.loading = true
        $this.BaseRequest({
          url:this.tableDataUrl,
          method:"get",
          params:params
        }).then(response=>{
            if(response.dataList!=null){
              response.dataList.forEach(originObj =>{
                $this.originDataObjs[originObj.origin_id] = originObj
              })
            }
            $this.originDataList = response.dataList
            $this.pager.total = response.totalNum
            $this.loading = false
        })
      },
      formatterSuperName(row){
        return this.originDataObjs[row.parent_origin_id]!=null?this.originDataObjs[row.parent_origin_id].origin_name:"无"
      },
      refreshTableList(dataList){
        this.dataSourceList = dataList
      }
    },
    mounted(){
      this.originDataList = []
      this.getTableData(1)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $seachRowHeight : 0px;
  $tableRowHeight : calc(100% - #{$seachRowHeight+10});
  .search-row{
    height:$seachRowHeight;
  }

  .table-row{
    height:$tableRowHeight;
    overflow: auto;
  }

</style>
