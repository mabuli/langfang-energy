/**
 * Created by SongCQ on 2018/9/28.
 */
import { Modal } from 'ant-design-vue'


const failedProcess = {}

failedProcess.checkWorkbenchResultOutMessage = function(response){
  return this.checkWorkbenchResult(response,false)
}

failedProcess.checkWorkbenchResult = function(response,withMessage){
  let res = response.data
  try{
    res = JSON.parse(response.data)
  }catch (e){

  }
  if (res.result !== 'SUCCESS') {
    if (res.faild_reason === 'USER_NOT_LOGIN') {
      if(withMessage==null||withMessage==true){
        Modal.confirm({
          title:'提示',
          okText:'重新登录',
          content:'你已被登出，可以取消继续留在该页面，或者重新登录',
          onOk () {
            window.location = "/"
          }
        })
        return false
      }else{
        return false
      }

    }else if(res.faild_reason === 'FORWARD_CAS'){
      if(withMessage==null||withMessage==true) {
        Modal.confirm({
          title:'提示',
          okText:'重新登录',
          content:'未登陆或登录已超时,请重新登录',
          onOk () {
            let forwardUrl = res.resultData
            window.location = forwardUrl
          }
        })
        return
      }else{
        return res
      }

    }else{
      Modal.error(res.result_msg)
    }
    return false
  } else {
    return res.resultData
  }
}

export default failedProcess
