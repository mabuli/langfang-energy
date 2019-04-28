package com.seaboxdata.lfny.demo.service;

import com.seaboxdata.lfny.demo.entity.Submitauthority;
import com.seaboxdata.lfny.demo.tree.EntityTree;
import com.webapp.support.page.PageResult;

import java.util.List;


public interface SubmitauthorityService {

    List<EntityTree> listAllSubmitauthority();

    PageResult listSubmitauthority(int currPage, int pageSize);

    void addSubmitauthority(Submitauthority submitauthority);

    void deleteById(String originId);
}
