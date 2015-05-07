package uap.web.ecmgr.repository.emall;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.util.Assert;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.MgrFunction;
import uap.web.ecmgr.repository.MgrFunctionJdbcDao;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class FunctionDaoTest extends SpringTransactionalTestCase {

	@Autowired
	private MgrFunctionJdbcDao dao;
	
	@Test
	public void findByUserId() throws Exception {
		List<MgrFunction> list = dao.findAllFuncsByUserId(1L);
		Assert.notEmpty(list);
	}
	
}
