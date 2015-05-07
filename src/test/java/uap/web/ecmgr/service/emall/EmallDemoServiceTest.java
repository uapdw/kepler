package uap.web.ecmgr.service.emall;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.util.Assert;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.EmallDemo;

@TransactionConfiguration(defaultRollback=false)
@ContextConfiguration(locations = { "/applicationContext.xml" })
public class EmallDemoServiceTest extends SpringTransactionalTestCase{

	@Autowired
	private EmallDemoService service;
	
	@Test
	public void testGetById(){
		
		EmallDemo demo = service.getEmallDemoById(101L);
		Assert.notNull(demo);
	}
	
	@Test
	public void testSave() throws Exception{
		for (int i = 0; i < 100; i++) {
			EmallDemo demo = new EmallDemo();
			demo.setCode("code_" + i);
			demo.setName("名称_"+i);
			demo.setMemo("说明文字_"+i);
			demo.setIsdefault("Y");
			service.saveEntity(demo);
		}
	}
}
