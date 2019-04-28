package com.seaboxdata.lfny.demo.tree;

import java.util.List;

/**
 * 树形数据实体接口 
 * @param <T>
 */
public interface ITree<T> {
	
     String getId();
	
     String getParentId();
    
     void setChildren(List<T> childList);
    
     List<T> getChildren();
}
