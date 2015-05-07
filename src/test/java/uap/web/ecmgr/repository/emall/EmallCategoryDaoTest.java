package uap.web.ecmgr.repository.emall;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.util.Assert;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.EmallCategory;
import uap.web.ecmgr.repository.EmallCategoryDao;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class EmallCategoryDaoTest extends SpringTransactionalTestCase {

	@Autowired
	private EmallCategoryDao dao;
	
	@Test
	public void findById() throws Exception {
		EmallCategory cate = dao.findById(1000L);
		System.out.println(cate);
	}
	
	@Test
	public void findByCatCode() throws Exception {
		EmallCategory cate = dao.findByCatCode("001.001.003");
		Assert.notNull(cate);
		
		System.out.println(cate.getCatName());
		
		List<EmallCategory> cates = dao.findByParentCode("001.001.003");
		Assert.notNull(cates);
		for (EmallCategory emallCategory : cates) {
			System.out.println("---" + emallCategory.getCatName());
		}
	}
	
	@Test
	public void findByCatCodeLike() throws Exception {
		List<EmallCategory> cates = dao.findByCatCodeLike("%001.001%");
		Assert.notNull(cates);
		for (EmallCategory emallCategory : cates) {
			System.out.println(emallCategory.getCatName());
		}
	}
}
