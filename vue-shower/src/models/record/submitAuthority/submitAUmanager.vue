<template>
  <WorkMain :headerItems="['报送管理','报送机构管理']">
    <a-row class="search-row" :gutter="20">
      <a-col class="align-left" :span="17">
        <a-button @click="openAddModal" type="primary">新增</a-button>
      </a-col>
    </a-row>
    <a-row class="table-row">
      <a-col :span="24">
        <a-table
          :data="originDataList"
          style="width: 100%">
          <a-table-column
            prop="origin_id"
            align="left"
            label="机构编号">
          </a-table-column>
          <a-table-column
            prop="origin_name"
            align="left"
            hidden="hidden"
            label="机构名称">
          </a-table-column>
          <a-table-column
            prop="parent_origin_id"
            align="left"
            label="上级机构编号">
          </a-table-column>
          <a-table-column
            prop="parent_origin_name"
            align="left"
            label="上级机构名称"
            :formatter="formatterSuperName"
          >
          </a-table-column>
          <a-table-column
            label="操作"
            align="left"
            >
            <template slot-scope="scope">
              <a-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</a-button>
              <a-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>

    <!-- 新增、编辑 弹窗-->
    <a-dialog :title="dialogTitle" :visible.sync="showModalPage" >
      <a-row :gutter="16">
        <a-col :sm="12" >
          <a-row>
            <a-input
              placeholder="输入机构名称快速查找机构"
              v-model="filterText">
            </a-input>
            <a-tree
              accordion
              class="filter-tree"
              :data="data"
              :props="defaultProps"
              ref="searchConditionRef"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick">
            </a-tree>

          </a-row>
        </a-col>
        <a-col :sm="12">
          <a-row>
            <a-col :span="6" :offset="1">上级机构</a-col>
            <a-col :span="17">
              <a-input placeholder="上级机构" v-model="formSubmitData.parent_origin_name" class="input-with-select" readonly="true"></a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6" :offset="1">机构名称</a-col>
            <a-col :span="17">
              <a-input placeholder="机构名称" v-model="formSubmitData.origin_name" class="input-with-select" ></a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6" :offset="1">机构状态</a-col>
            <a-col :span="17">
              <a-select v-model="formSubmitData.origin_status" placeholder="请选择机构状态">
                <a-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </a-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div slot="footer" class="dialog-footer">
        <a-button @click="closeModal">取 消</a-button>
        <a-button type="primary" @click="handleInsert">确 定</a-button>
      </div>
    </a-dialog>
  </WorkMain>
</template>

<script>
import WorkTablePager from '@/models/public/WorkTablePager'
import WorkMain from '@/models/public/WorkMain'
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'SubmitAUmanager',
  data () {
    return {
      originDataList: [],
      originDataObjs: {},
      tableDataUrl: 'submitAU/listSubmitauthority',
      currPageNum: 1,
      eachPageNum: 10,
      totalPage: 1,
      showModalPage: false,
      isEditModal: false,
      dialogTitle: '',
      formSubmitData: {
        origin_name: '',
        parent_origin_id: '',
        parent_origin_name: '',
        origin_status: ''
      },
      search: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      data: [],
      options: [{
        value: '1',
        label: '正常'
      }, {
        value: '0',
        label: '停用'
      }, {
        value: '9',
        label: '注销'
      }]
    }
  },
  watch: {// 监听节点搜索的内容
    filterText (val) {
      this.$refs.searchConditionRef.filter(val)
    }
  },
  validations: {// 提交前的验证
    formSubmitData: {
      origin_name: {
        required
      },
      origin_status: {
        required
      }
    }
  },
  computed: {
    // 初始化加载

  },
  components: {
    WorkTablePager,
    WorkMain
  },
  methods: {
    getTableData: function (pageNum) {
      if (pageNum && pageNum !== '') {
        this.currPageNum = pageNum
      } else {
        pageNum = this.currPageNum
      }
      const $this = this
      this.BaseRequest({
        url: this.tableDataUrl,
        method: 'get',
        params: {currPage: pageNum, pageSize: this.eachPageNum}
      }).then(response => {
        if (response.dataList != null) {
          response.dataList.forEach(originObj => {
            $this.originDataObjs[originObj.origin_id] = originObj
          })
        }
        $this.originDataList = response.dataList
        $this.totalPage = response.totalPage
      })
    },
    formatterSuperName: function (row) {
      return this.originDataObjs[row.parent_origin_id] != null ? this.originDataObjs[row.parent_origin_id].origin_name : '无'
    },
    refreshTableList: function (dataList) {
      this.originDataList = dataList
    },
    openAddModal: function () {
      this.clearData()
      this.dialogTitle = '新增机构'
      this.formSubmitData.origin_status = '1'
      this.getOriginList()
      this.showModalPage = true
      this.isEditModal = false
    },
    closeModal: function () {
      this.showModalPage = false
      this.isEditModal = false
    },
    getOriginList () { // 弹出model触发、获取机构树状展示
      this.BaseRequest({
        url: 'submitAU/listAllSubmitauthority',
        method: 'get'
      }).then(response => {
        if (response != null && response.length > 0) {
          this.data = []
          this.data = response
        }
      })
    },
    handleNodeClick (data) { // 点击树的节点进行赋值
      this.formSubmitData.parent_origin_id = data.id
      this.formSubmitData.parent_origin_name = data.label
    },
    filterNode (value, data) { // 树节点的过滤
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleInsert () { // 添加、修改确定按钮触发
      if (this.checkInputNull()) {
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '保存中',
        spinner: 'a-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.BaseRequest({
        url: '/submitAU/addSubmitauthority',
        method: 'post',
        data: this.formSubmitData
      }).then(() => {
        this.Message.success('保存成功')
        loading.close()
        this.closeModal()
        this.getTableData()
      }).catch(error => {
        console.log(error)
        loading.close()
        this.Message.error('保存失败' + error)
      })
    },
    handleEdit (index, row) { // 修改
      this.dialogTitle = '修改机构'
      this.showModalPage = true
      this.isEditModal = true
      this.formSubmitData.origin_id = row.origin_id
      this.formSubmitData.origin_name = row.origin_name
      this.formSubmitData.origin_status = row.origin_status
      this.formSubmitData.parent_origin_id = row.parent_origin_id
      this.formSubmitData.parent_origin_name = this.formatterSuperName(row)
    },
    clearData () { // 每次添加之前清空数据、
      /* //this.formSubmitData= {};
        // this.formSubmitData.origin_status= '';
        // this.formSubmitData.parent_origin_id= '';
        // this.formSubmitData.parent_origin_name= ''; */
      this.formSubmitData = {
        origin_name: null,
        parent_origin_id: null,
        parent_origin_name: null,
        origin_status: null
      }
    },
    handleDelete (index, row) { // 删除
      this.$confirm("确定要删除【"+row.origin_name+"】机构？删除动作为级联操作，会使该机构下的所有机构都被删除！！！", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.BaseRequest({
          url: '/submitAU/delById',
          method: 'get',
          params: {'originId': row.origin_id}
        }).then(() => {
          this.Message.success('删除成功')
          this.getTableData()
        })
      }).catch(() => {
      })
    },
    checkInputNull () {
      const checkResult = this.$v.$invalid
      if (checkResult) {
        this.$notify({
          dangerouslyUseHTMLString: true,
          message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>机构名称、机构状态'
        })
      }
      return checkResult
    }
  },
  mounted: function () { // 初始化
    this.originDataList = []
    this.getTableData(1)
    this.getOriginList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "@/styles/table-page.scss";

  .a-row{
    margin-top:20px;
  }

  $seachRowHeight : 50px;
  $pagerRowHeight : 50px;
  $tableRowHeight : calc(100% - #{$seachRowHeight+$pagerRowHeight+10});
  .search-row{
    height:$seachRowHeight;
  }

  .table-row{
    height:$tableRowHeight;
    overflow: auto;
  }

  .pager-row{
    height:$pagerRowHeight;
  }
</style>
