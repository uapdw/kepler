/*******************************************************************************
 * Copyright (c) 2005, 2014 springside.github.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *******************************************************************************/
package uap.web.ecmgr.service.account;

import java.security.Security;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.persistence.DynamicSpecifications;
import org.springside.modules.persistence.SearchFilter;
import org.springside.modules.security.utils.Digests;
import org.springside.modules.utils.Clock;
import org.springside.modules.utils.Encodes;

import uap.web.ecmgr.entity.MgrFunction;
import uap.web.ecmgr.entity.User;
import uap.web.ecmgr.repository.MgrFunctionJdbcDao;
import uap.web.ecmgr.repository.UserDao;
import uap.web.ecmgr.service.account.ShiroDbRealm.ShiroUser;
import uap.web.service.ServiceException;

/**
 * 用户管理类.
 * 
 * @author calvin
 */
// Spring Service Bean的标识.
@Component
@Transactional
public class AccountService {

	public static final String HASH_ALGORITHM = "SHA-1";
	public static final int HASH_INTERATIONS = 1024;
	private static final int SALT_SIZE = 8;

	private static Logger logger = LoggerFactory.getLogger(AccountService.class);

	private UserDao userDao;
	
	@Autowired
	private MgrFunctionJdbcDao funcDao;
	
	private Clock clock = Clock.DEFAULT;

	public List<User> getAllUser() {
		return (List<User>) userDao.findAll();
	}

	public User getUser(Long id) {
		return userDao.findOne(id);
	}

	public User findUserByLoginName(String loginName) {
		return userDao.findByLoginName(loginName);
	}

	public void registerUser(User user) {
		entryptPassword(user);
		user.setRoles("user");
		user.setRegisterDate(clock.getCurrentDate());

		userDao.save(user);
	}
	
	public boolean registerCustomUser(User user) {
		try {
			entryptPassword(user);
			user.setRoles("user");
			user.setRegisterDate(clock.getCurrentDate());
			userDao.save(user);
			funcDao.addRoleUser(user.getId());
			
		} catch (Exception e) {
			logger.error("注册用户失败!");
			return false;
		}
		
		return true;
	}

	public void updateUser(User user) {
		if (StringUtils.isNotBlank(user.getPlainPassword())) {
			entryptPassword(user);
		}
		userDao.save(user);
	}

	public void deleteUser(Long id) {
		if (isSupervisor(id)) {
			logger.warn("操作员{}尝试删除超级管理员用户", getCurrentUserName());
			throw new ServiceException("不能删除超级管理员用户");
		}
		userDao.delete(id);

	}

	/**
	 * 判断是否超级管理员.
	 */
	private boolean isSupervisor(Long id) {
		return id == 1;
	}

	/**
	 * 取出Shiro中的当前用户LoginName.
	 */
	private String getCurrentUserName() {
		ShiroUser user = (ShiroUser) SecurityUtils.getSubject().getPrincipal();
		return user.loginName;
	}

	/**
	 * 设定安全的密码，生成随机的salt并经过1024次 sha-1 hash
	 */
	private void entryptPassword(User user) {
		byte[] salt = Digests.generateSalt(SALT_SIZE);
		user.setSalt(Encodes.encodeHex(salt));
		byte[] hashPassword = Digests.sha1(user.getPlainPassword().getBytes(), salt, HASH_INTERATIONS);
		user.setPassword(Encodes.encodeHex(hashPassword));
	}
	
	/**
	 * 创建动态查询条件组合.
	 */
	public Specification<User> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<User> user = DynamicSpecifications.bySearchFilter(filters.values(), User.class);
		return user;
	}
	
	public Page<User> getAccountPage(Map<String, Object> searchParams, PageRequest pageRequest) {
		Specification<User> spec = buildSpecification(searchParams);
		return userDao.findAll(spec, pageRequest);
	}
	
	@Transactional
	public User saveEntity(User entity) throws Exception{
		entryptPassword(entity);
		if(0 == entity.getId()){
			entity.setId(userDao.getNextId());
			entity.setRegisterDate(clock.getCurrentDate());
		}
		//funcDao.addRoleUser(entity.getId());
		return userDao.save(entity);
	}

	@Autowired
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}
	public void setClock(Clock clock) {
		this.clock = clock;
	}
}
