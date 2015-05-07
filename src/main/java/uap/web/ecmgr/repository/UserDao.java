/*******************************************************************************
 * Copyright (c) 2005, 2014 springside.github.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *******************************************************************************/
package uap.web.ecmgr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import uap.web.ecmgr.entity.MgrFunction;
import uap.web.ecmgr.entity.User;

public interface UserDao extends PagingAndSortingRepository<User, Long>,JpaSpecificationExecutor<User> {
	User findByLoginName(String loginName);
	
	@Query("select u from User u where roles in (:con)")
	List<User> findByCondition(@Param("con")String[] con);
	
	User findById(long id);
	
	@Query("select max(func.id)+1 from MgrFunction func")
	long getNextId();
	
}
