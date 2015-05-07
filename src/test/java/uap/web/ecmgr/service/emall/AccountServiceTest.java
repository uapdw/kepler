package uap.web.ecmgr.service.emall;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.User;
import uap.web.ecmgr.service.account.AccountService;

@TransactionConfiguration(defaultRollback=false)
@ContextConfiguration(locations = { "/applicationContext.xml" })
public class AccountServiceTest extends SpringTransactionalTestCase{

	@Autowired
	private AccountService service;
	
	@Test
	public void testRegistCustomUser(){
		
		User newUser = new User();
		newUser.setLoginName("liujianmin");
		newUser.setName("liujianmin");
		newUser.setPlainPassword("liujianmin");
		service.registerCustomUser(newUser);
		
	}
	
}
