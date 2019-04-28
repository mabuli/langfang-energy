package com.seaboxdata.lfny.demo.service.impl;

import com.github.pagehelper.Page;
import com.seaboxdata.lfny.demo.dao.ISubmitauthorityDao;
import com.seaboxdata.lfny.demo.entity.Submitauthority;
import com.seaboxdata.lfny.demo.service.SubmitauthorityService;
import com.seaboxdata.lfny.demo.tree.EntityTree;
import com.webapp.support.page.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service("submitauthority")
public class SubmitauthorityServiceImp implements SubmitauthorityService {

    @Autowired
    private ISubmitauthorityDao submitauthorityDao;

    @Override
    public List<EntityTree> listAllSubmitauthority() {
        return submitauthorityDao.listAllSubmitauthority();
    }

    @Override
    public PageResult listSubmitauthority(int currPage, int pageSize) {
        Page<Submitauthority> submitauthorityPage = submitauthorityDao.listSubmitauthority(currPage, pageSize);
        PageResult pageResult = PageResult.pageHelperList2PageResult(submitauthorityPage);
        return pageResult;
    }

    @Override
    public void addSubmitauthority(Submitauthority submitauthority) {
        if(submitauthority.getOrigin_id()!=null){
            submitauthorityDao.updateSubmitauthority(submitauthority);
        }else{
            submitauthorityDao.addSubmitauthority(submitauthority);
        }
    }

    @Override
    public void deleteById(String originId) {
        //获取originId下的所有报送机构
        Map<String, Object> originTree = submitauthorityDao.getOriginById(originId);
        List finalOriginList = new ArrayList();
        checkOrigins(originTree,finalOriginList);
        submitauthorityDao.deleteByListId(finalOriginList);
    }

    private void checkOrigins(Map<String, Object> origin,List finalOriginList){
        List<Map<String, Object>> children = (List)origin.get("childrens");
        finalOriginList.add(origin.get("origin_id"));
        if(children!=null&&children.size()>0){
            children.forEach(child->{
                checkOrigins(child,finalOriginList);
            });
        }
    }
}
