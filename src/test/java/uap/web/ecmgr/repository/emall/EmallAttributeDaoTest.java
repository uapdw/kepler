package uap.web.ecmgr.repository.emall;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.util.Assert;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.EmallAttribute;
import uap.web.ecmgr.repository.EmallAttributeDao;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class EmallAttributeDaoTest extends SpringTransactionalTestCase {

	@Autowired
	private EmallAttributeDao attrDao;

	@Test
	public void findByAttrCode() throws Exception {
		List<EmallAttribute> attrs = attrDao.findByAttrCode("12");
		Assert.notNull(attrs);
		for (EmallAttribute emallAttribute : attrs) {
			System.out.println(emallAttribute.getAttrName());
		}
	}

	@Test
	public void findByAttrCodeLike() throws Exception {
		List<EmallAttribute> attrs = attrDao.findByAttrCodeLike("%12%");
		Assert.notNull(attrs);
		for (EmallAttribute emallAttribute : attrs) {
			System.out.println(emallAttribute.getAttrName());
		}
	}

	@Test
	public void findByAttrName() throws Exception {
		List<EmallAttribute> attrs = attrDao.findByAttrName("TEST");
		Assert.notNull(attrs);
		for (EmallAttribute emallAttribute : attrs) {
			System.out.println(emallAttribute.getId());
		}

	}

	@Test
	public void findByAttrNameLike() throws Exception {
		List<EmallAttribute> attrs = attrDao.findByAttrNameLike("%工艺%");
		Assert.notNull(attrs);
		for (EmallAttribute emallAttribute : attrs) {
			System.out.println(emallAttribute.getAttrName());
		}
	}

	@Test
	public void findByAttrNameAndCode() throws Exception {
		List<EmallAttribute> attrs = attrDao.findByAttrNameAndCode("5", "TEST");
		Assert.notNull(attrs);
		for (EmallAttribute emallAttribute : attrs) {
			System.out.println(emallAttribute.getAttrCode() + " " + emallAttribute.getAttrName());
		}
	}

	@Test
	public void getNextId() throws Exception {
		Long nextId = attrDao.getNextId();
		System.out.println("nextId=" + nextId);

	}

}
