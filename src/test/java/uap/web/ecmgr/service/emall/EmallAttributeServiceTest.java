package uap.web.ecmgr.service.emall;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.EmallAttribute;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class EmallAttributeServiceTest extends SpringTransactionalTestCase{
	
	@Autowired
	private EmallAttributeService attrService;
	
	@Test 
	public void find() throws Exception {
		EmallAttribute attr = attrService.getAttributeInfo(1000L);
		System.out.println(attr.getAttrName());
	}
	
	@Test
	public void findByAttrCode() throws Exception {
		List<EmallAttribute> attrs = attrService.findByAttrCode("12");
		for(EmallAttribute attr:attrs) {
			System.out.println(attr.getAttrName());
		}
	}

}
