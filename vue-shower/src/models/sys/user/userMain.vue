<template>
  <WorkMain :headerItems="['用户管理','用户列表']">
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
          rowKey="user_id"
          style="width: 100%">
          <a-table-column
            dataIndex="user_id"
            align="left"
            title="用户ID">
          </a-table-column>
          <a-table-column
            dataIndex="user_name"
            align="left"
            title="用户名称">
          </a-table-column>
          <a-table-column
            dataIndex="reg_date"
            align="left"
            title="首次登入日期">
          </a-table-column>
          <a-table-column
            dataIndex="last_login_time"
            align="left"
            title="最后登入日期">
          </a-table-column>
          <a-table-column
            title="操作"
            align="center">
            <template slot-scope="text,record">
              <a-button @click="openEditModal(record)" size="small">编辑</a-button>
              <a-button @click="openAuthModal(record)" size="small">权限</a-button>
              <a-button @click="delUser(record)" size="small">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>

    <!-- 新增、编辑 弹窗-->
    <a-modal :title="modalPageTitle" v-model="showModalPage" >
      <a-form class="modal-form" label-width="20%">
        <!--
        <a-form-item label="用户登陆名" >
          <a-input auto-complete="off" ></a-input>
        </a-form-item>
        -->
        <a-form-item label="用户名称" >
          <a-input v-model="formData.user_name" auto-complete="off" ></a-input>
        </a-form-item>

        <a-form-item label="所属机构" >
          <treeselect v-model="formData.origin_id" :options="options" />
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer">
        <a-button @click="closeModal">取 消</a-button>
        <a-button type="primary" @click="submitDataForm()">确 定</a-button>
      </div>
    </a-modal>

    <!--用户权限设置-->
    <a-modal title="用户权限" v-model="showUserAuth" >
      <a-form class="modal-form" label-width="20%" :model="formData">
        <a-form-item label="用户名称" >
          <a-input :disabled="true"  :value="formData.user_name" auto-complete="off" ></a-input>
        </a-form-item>
        <a-form-item label="角色" >
          <a-select v-model="user_role_id" style="width:100%;" placeholder="请选择角色">
            <a-select-option :key="roleData.user_role_id" v-for="roleData in allRoleList" :value="roleData.user_role_id">{{ roleData.user_role_name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer">
        <a-button @click="closeUserAuthModal">取 消</a-button>
        <a-button type="primary" @click="saveUserRole()">确 定</a-button>
      </div>
    </a-modal>
  </WorkMain>
</template>

<script>
  import WorkMain from '@/models/public/WorkMain'
  import { required } from 'vuelidate/lib/validators'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import "@/styles/table-page.scss"

  export default {
    name: 'UserMain',
    data () {
      return {
        userDataList: [],
        originList: [],
        userType: 1,
        tableDataUrl: 'sys/user/listUserPage',
        pager: {
          pageSizeOptions: ['10', '50', '100', '200'],
          current: 1,
          total:1,
          pageSize: 10,
          showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
        },
        loading:false,
        showModalPage:false,
        isEditModal: false,
        showUserAuth: false,
        showOrigin: false,
        allRoleList: [],
        user_role_id: '',
        formData: {
          user_id:null,
          user_name: null,
          origin_id: null,
        },
        options: []
      }
    },
    validations: {
      formData: {
        user_name: {
          required
        },
        origin_id: {
          required
        }
      }
    },
    computed: {
      modalPageTitle () {
        if (this.isEditModal) {
          return '修改用户'
        } else { return '新增用户' }
      }
    },
    components: {
      Treeselect,
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
      getTableData: function (pageNum) {
        const $this = this
        let params = $this.getQueryParm(pageNum, {userType: this.userType})
        $this.loading = true
        this.BaseRequest({
          url: this.tableDataUrl,
          method: 'get',
          params: params
        }).then(response => {
          $this.userDataList = response.dataList
          $this.pager.total = response.totalNum
          $this.loading = false
        })
      },
      getOriginList () { // 弹出model触发、获取机构树状展示
        this.BaseRequest({
          url: 'submitAU/listAllSubmitauthority',
          method: 'get'
        }).then(response => {
          if (response != null && response.length > 0) {
            this.data = []
            this.options = response
            this.data = response
          }
        })
      },
      delUser (row) {
        const that = this
        that.Confirm({
          title:'提示',
          content:'确定删除用户【' + row.user_name + '】？',
          onOk () {
            that.BaseRequest({
              url: 'sys/user/delUserByUserId',
              method: 'get',
              params: {'user_id': row.user_id}
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
        this.isEditModal = false
      },
      clearData () {
        this.formData = {
          user_id: null,
          user_name: null,
          origin_id: null
        }
      },
      openEditModal (row) { // user edit
        this.clearData()
        this.showModalPage = true
        this.isEditModal = true
        console.log(row)
        this.formData.user_name = row.user_name
        this.formData.user_id = row.user_id
        // set options value
        this.BaseRequest({
          url: 'origin/getOriginByUser',
          method: 'get',
          params: {'userId': row.user_id}
        }).then(reponse => {
          this.formData.origin_id = reponse.origin_id
        })
      },
      submitDataForm () { // user submit
        if (this.checkInputNull()) {
          return
        }
        if (this.isEditModal) { // update
          this.BaseRequest({
            url: 'sys/user/updateSaveUser',
            method: 'POST',
            data: {'user_name': this.formData.user_name, 'user_id': this.formData.user_id, 'user_type': this.userType}
          }).then(() => {
            this.Message.success('保存成功')
            // add user——origin relation
            this.changeOrigin()
            this.getTableData()
            this.closeModal()
          })
        } else { // insert
          this.BaseRequest({
            url: 'sys/user/saveNewUser',
            method: 'get',
            params: {'user_name': this.formData.user_name, 'user_type': this.userType}
          }).then((response) => {
            this.Message.success('保存成功')
            // add user——origin relation
            this.formData.user_id = response.user_id
            this.changeOrigin()
            this.getTableData()
            this.closeModal()
          })
        }
      },
      changeOrigin(){
        this.BaseRequest({
          url:"origin/userOriginSave",
          method:'get',
          params:{"userId":this.formData.user_id,"originId":this.formData.origin_id}
        }).then(response=>{
          this.Message.success("保存成功")
          this.closeModal()
        })
      },
      openAuthModal (row) { // edit
        const $this = this
        this.showUserAuth = true
        // this.formData = row
        this.formData.user_id = row.user_id
        this.formData.user_name = row.user_name
        this.BaseRequest({
          url: 'sys/userRole/getRoleByUserId',
          method: 'get',
          params: {user_id: this.formData.user_id}
        }).then(response => {
          if (response != null && response.length > 0) {
            // set value for update
            $this.user_role_id = response[0]['user_role_id']
            $this.formData.user_role_id = response[0]['user_role_id']
          }
        })
      },
      saveUserRole () { // 权限保存修改
        this.BaseRequest({
          url: 'sys/userRole/updateUserRole',
          method: 'get',
          params: {user_id: this.formData.user_id, user_role_id: this.user_role_id, old_user_role_id: this.formData.user_role_id}
        }).then(() => {
          this.Message.success('保存成功')
          this.showUserAuth = false
        })
      },
      closeModal () {
        this.showModalPage = false
        this.isEditModal = false
      },
      closeUserAuthModal () {
        this.showUserAuth = false
      },

      checkInputNull () {
        const checkResult = this.$v.$invalid
        if (checkResult) {
          this.Notify.error({
            message:'以下参数不允许为空',
            style:'font-size:15px;color:red;font-weight: bold',
            description:'用户名称、所属机构'
          })
        }
        return checkResult
      }
    },
    mounted () {
      this.userDataList = []
      this.getTableData(1)
      const $this = this
      this.getOriginList()
      this.BaseRequest({
        url: 'sys/role/rolePageData',
        method: 'get',
        params: {currPage: 1, pageSize: 100}
      }).then(response => {
        $this.allRoleList = response.dataList
      })
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
    width:99%;
    height:$tableRowHeight;
    overflow: auto;
  }

</style>
