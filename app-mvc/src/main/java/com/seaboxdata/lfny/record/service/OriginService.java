package com.seaboxdata.lfny.record.service;

import com.seaboxdata.lfny.record.entity.Origin;
import com.webapp.support.page.PageResult;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface OriginService {

    List<Origin> listAllOrigin();
    PageResult listOrigin(int currPage, int pageSize);
    void createOrigin(Origin origin);
    Map<String,Object> getOriginById(Integer origin_id);

    void userOriginSave(Integer originId, Integer userId);

    Origin getOriginByUser(Integer userId);

    List<Origin> checkAllChildren(Integer originId);
}
