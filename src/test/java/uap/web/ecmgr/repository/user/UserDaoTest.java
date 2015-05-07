package uap.web.ecmgr.repository.user;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.User;
import uap.web.ecmgr.repository.UserDao;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class UserDaoTest extends SpringTransactionalTestCase {

	@Autowired
	private UserDao userDao;
	
	@Test
	public void findByLoginName() throws Exception {
		List<User> users = (List<User>) userDao.findAll();
		System.out.print(users.size());
	}
	
	@Test
	public void findByCon() throws Exception {
		List<User> users = (List<User>) userDao.findByCondition(new String[]{"admin","user"});
		System.out.print(users.size());
	}
	
	@Test
	public void findById() throws Exception {
		User user = userDao.findById(1L);
		System.out.print(user);
	}
	
}
