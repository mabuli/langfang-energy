<template>
  <WorkMain :headerItems="['角色管理','角色列表']">
    <a-row class="search-row" :gutter="20">
      <a-col class="align-left" :span="17">
        <a-button @click="openAddModal" type="primary">新增</a-button>
      </a-col>
    </a-row>

    <a-row class="table-row">
      <a-col :span="24">
        <a-table
          :dataSource="userDataList"
          :pagination="pager"
          @change="getTableData"
          :loading="loading"
          rowKey="user_role_id"
          style="width: 100%">
          <a-table-column
            dataIndex="user_role_id"
            align="left"
            title="角色ID">
          </a-table-column>
          <a-table-column
            dataIndex="user_role_name"
            align="left"
            title="角色名称">
          </a-table-column>
          <a-table-column
            title="操作"
            align="left">`
            <template slot-scope="text,record">
              <a-button @click="openRoleFunction(record)" size="small">功能</a-button>
              <a-button @click="openEditModal(record)" size="small">编辑</a-button>
              <a-button @click="delRole(record)" size="small">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>

    <!-- 新增、编辑 弹窗-->
    <a-modal :title="modalPageTitle" v-model="showModalPage" >
      <a-form class="modal-form" label-width="20%">
        <a-form-item label="角色编号" >
          <a-input :disabled="isEditModal" v-model="formData.user_role_id" auto-complete="off" ></a-input>
        </a-form-item>
        <a-form-item label="角色名称" >
          <a-input v-model="formData.user_role_name" auto-complete="off" ></a-input>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer">
        <a-button @click="closeModal">取 消</a-button>
        <a-button type="primary" @click="submitDataForm()">确 定</a-button>
      </div>
    </a-modal>

    <!-- 角色、功能关联关系菜单 -->
    <a-modal title="角色功能" v-model="showRoleFunction" >
      <a-transfer :titles="['未选功能', '已选功能']" class="role-transfer"
                  :targetKeys="menuCheckedForRole"
                  :dataSource="roleFunctionData"
                  :render="item=>item.title"
                  @change="handleChange"></a-transfer>
      <div slot="footer" class="dialog-footer">
        <a-button @click="closeRoleMenus">取 消</a-button>
        <a-button type="primary" @click="subRoleMenus()">确 定</a-button>
      </div>

    </a-modal>
  </WorkMain>
</template>

<script>
import WorkMain from '@/models/public/WorkMain'
import { required } from 'vuelidate/lib/validators'
import MenuTurnner from '@/models/public/utils/menuTurner'
import "@/styles/table-page.scss"

export default {
  name: 'RoleMain',

  data () {
    return {
      userDataList: [],
      termForSearch: '',
      tableDataUrl: 'sys/role/rolePageData',
      pager: {
        pageSizeOptions: ['10', '50', '100', '200'],
        current: 1,
        total:1,
        pageSize: 10,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      loading:false,
      showModalPage:false,
      showRoleFunction: false,
      isEditModal: false,
      edit_role_id: null,
      formData: {
        user_role_id: null,
        user_role_name: null
      },
      roleFunctionData: [],
      menuCheckedForRole: []
    }
  },
  validations: {
    formData: {
      user_role_name: {
        required
      }
    }
  },
  computed: {
    modalPageTitle () {
      if (this.formData.user_role_id !== null) {
        return '修改角色'
      } else {
        return '新增角色'
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
    getTableData (pageNum) {
      const $this = this
      let params = $this.getQueryParm(pageNum, {search: this.termForSearch || ''})
      $this.loading = true
      this.BaseRequest({
        url: this.tableDataUrl,
        method: 'get',
        params: params
      }).then((response) => {
        $this.userDataList = response.dataList
        $this.pager.total = response.totalNum
        $this.loading = false
      })
    },
    delRole (row) {
      const that = this
      that.Confirm({
        title:'提示',
        content:'确定删除角色【' + row.user_name + '】？',
        onOk () {
          that.BaseRequest({
            url: 'sys/role/deleteRole',
            method: 'get',
            params: {'user_role_id': row.user_role_id}
          }).then(() => {
            that.Message.success('删除成功')
            that.getTableData()
          })
        },
      })
    },
    openAddModal () {
      this.clearData()
      this.showModalPage = true
      this.isEditModal = true
    },
    openEditModal (row) {
      this.formData.user_role_id = row.user_role_id
      this.formData.user_role_name = row.user_role_name
      this.showModalPage = true
      this.isEditModal = true
    },
    clearData () {
      this.formData.user_role_id = null
      this.formData.user_role_name = null
    },
    closeModal () {
      this.showModalPage = false
      this.isEditModal = false
    },
    closeRoleMenus () {
      this.showRoleFunction = false
    },
    openRoleFunction (row) {
      this.showRoleFunction = true
      this.edit_role_id = row.user_role_id
      const $this = this
      this.BaseRequest({
        url: 'sys/roleMenu/getMenuByRole',
        method: 'get',
        params: {'user_role_id': row.user_role_id}
      }).then((response) => {
        $this.menuCheckedForRole = []
        if (response != null && response.length > 0) {
          response.forEach(menuData => {
            $this.menuCheckedForRole.push(menuData.module_id + '')
          })
        }
      })
    },
    submitDataForm () {
      if (this.checkInputNull()) {
        return
      }
      if (this.formData.user_role_id !== null) {
        this.BaseRequest({
          url: 'sys/role/updateSaveRole',
          method: 'post',
          data: this.formData
        }).then(() => {
          this.Message.success('保存成功')
          this.getTableData()
          this.closeModal()
        })
      } else {
        this.BaseRequest({
          url: 'sys/role/saveNewRole',
          method: 'post',
          data: this.formData
        }).then(() => {
          this.Message.success('保存成功')
          this.getTableData()
          this.closeModal()
        })
      }
    },
    handleChange(targetKeys) {
      this.menuCheckedForRole = targetKeys
    },
    subRoleMenus () {
      const perArr = this.menuCheckedForRole.map(a => { return parseInt(a) })
      this.BaseRequest({
        url: 'sys/roleMenu/saveMenusForRole',
        method: 'post',
        data: {'user_role_id': ''+this.edit_role_id, 'menus': perArr}
      }).then(() => {
        this.Message.success('保存成功')
        this.closeRoleMenus()
      })
    },
    checkInputNull () {
      const checkResult = this.$v.$invalid
      if (checkResult) {
        this.$notify({
          dangerouslyUseHTMLString: true,
          message: '<span style="font-size:15px;color:red;font-weight: bold">以下参数不允许为空</span><br>角色编号<br>角色名称'
        })
      }
      return checkResult
    }
  },
  mounted: function () {
    this.userDataList = []
    this.getTableData(1)
    const $this = this
    this.BaseRequest({
      url: 'sys/menu/listMenuByPage',
      method: 'GET',
      params: {'currPage': '1', 'pageSize': '200'}
    }).then(response => {
      response.dataList.forEach(menuData => {
        $this.roleFunctionData.push({key: menuData.module_id + '', title: menuData.module_name})
      })
    })
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
    width:99%;
    height:$tableRowHeight;
    overflow: auto;
  }

  .role-transfer{
    text-align: left;
  }
</style>
