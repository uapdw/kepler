package uap.web.ecmgr.repository.emall;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.util.Assert;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.MgrAd;
import uap.web.ecmgr.entity.MgrFunction;
import uap.web.ecmgr.repository.MgrAdDao;



@ContextConfiguration(locations = { "/applicationContext.xml" })
public class MgrAdDaoTest extends SpringTransactionalTestCase{
	@Autowired
	private MgrAdDao dao;
	
	@Test
	public void findById() throws Exception {
		MgrAd list = dao.findById(1L);
	}
}
