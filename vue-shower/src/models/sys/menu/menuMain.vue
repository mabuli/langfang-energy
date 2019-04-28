<template>
  <WorkMain :headerItems="['权限管理','功能查看']">

    <a-row class="table-row">
      <a-col :span="24">
        <a-table
          :dataSource="menuDataList"
          :pagination="pager"
          @change="getTableData"
          :loading="loading"
          rowKey="module_id"
          style="width: 100%">
          <a-table-column
            dataIndex="module_id"
            align="left"
            title="菜单编号">
          </a-table-column>
          <a-table-column
            dataIndex="module_name"
            align="left"
            title="菜单名称">
          </a-table-column>
          <a-table-column
            dataIndex="super_module_id"
            align="left"
            title="上级菜单编号">
          </a-table-column>
          <a-table-column
            dataIndex="super_module_name"
            align="left"
            title="上级菜单名称"
            :formatter="formatterSuperName"
          >
          </a-table-column>
          <a-table-column
            dataIndex="module_url"
            align="left"
            title="菜单地址">
          </a-table-column>

        </a-table>
      </a-col>
    </a-row>
  </WorkMain>
</template>1

<script>
  import WorkMain from "@/models/public/WorkMain"
  import { required } from 'vuelidate/lib/validators'
  import "@/styles/table-page.scss"
  export default {
    name: 'MenuMain',
    data() {
      return {
        menuDataList:[],
        menuDataObjs:{},
        tableDataUrl:'manage/datasource',
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

        this.BaseRequest({
          url:'/sys/menu/listMenuByPage',
          method:"get",
          params:params
        }).then(response=>{
            if(response.dataList!=null){
              response.dataList.forEach(menuObj =>{
                $this.menuDataObjs[menuObj.module_id] = menuObj
              })
            }
            $this.menuDataList = response.dataList
            $this.pager.total = response.totalNum
            $this.loading = false
        })
      },
      formatterSuperName(row){
        return this.menuDataObjs[row.super_module_id]!=null?this.menuDataObjs[row.super_module_id].module_name:"无"
      },
      refreshTableList(dataList){
        this.dataSourceList = dataList
      }
    },
    mounted(){
      this.menuDataList = []
      this.getTableData(1)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  $seachRowHeight : 50px;
  $tableRowHeight : calc(100% - #{$seachRowHeight+10});
  .search-row{
    height:$seachRowHeight;
  }

  .table-row{
    height:$tableRowHeight;
    overflow: auto;
  }
</style>
