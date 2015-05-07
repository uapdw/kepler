package uap.web.ecmgr.repository.emall;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.EmallBrand;
import uap.web.ecmgr.service.emall.EmallBrandService;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class EmallBrandServiceTest extends SpringTransactionalTestCase{
	@Autowired
	private EmallBrandService bandservice;
	@Test
	public void findBrandNameList(){
		List<EmallBrand> list=bandservice.getBrankByName("aijia");
		System.out.println(list);
	}
	
}
