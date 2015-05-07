package uap.web.ecmgr.repository.emall;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.util.Assert;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.EmallBrand;
import uap.web.ecmgr.repository.EmallBrandDao;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class EmallBrandDaoTest extends SpringTransactionalTestCase{
	@Autowired
	private EmallBrandDao BrandDao;
	@Test
	public void findByid() throws Exception {
		EmallBrand cate = BrandDao.findById(744L);
		System.out.println(cate.getBrandName());
	}
	@Test
	public void findByNameTest() throws Exception {
		List<EmallBrand> cate1 = BrandDao.findByName("aijia");
		Assert.notNull(cate1);
		System.out.println(cate1);
		
 }
	@Test
	public void findBylogo() throws Exception{
		EmallBrand cate =BrandDao.findByLogo("img/52368398498e6d1b2422f0d8.img");
		Assert.notNull(cate);
		System.out.println(cate.getId());
		}
	@Test
	public void findByBrandPinyinTest() throws Exception{
		List<EmallBrand> cate =BrandDao.findByBrandPinyin("y");
		Assert.notNull(cate);
		for(EmallBrand l:cate){
		System.out.println(l);
		}
	}
	@Test
	public void findByLinkTest() throws Exception{
		List<EmallBrand> cate =BrandDao.findByLink("velux.juran.cn");
		Assert.notNull(cate);
		for(EmallBrand l:cate){
		System.out.println(l);
		}
	}
	@Test
	public void findIsLocalTest() throws Exception{
		BigDecimal b=new BigDecimal(1);
		List<EmallBrand> cate =BrandDao.findIsLocal(b);
		Assert.notNull(cate);
		for(EmallBrand l:cate){
		System.out.println(l);
		}
	}

	@Test
	public void findBySortTest() throws Exception{
		BigDecimal b=new BigDecimal(715);
		List<EmallBrand> cate =BrandDao.findBySort(b);
		Assert.notNull(cate);
		System.out.println(cate);
	}

	@Test
	public void findByErpBrandIdTest() throws Exception{
		List<EmallBrand> cate =BrandDao.findByErpBrandId("12345");
		Assert.notNull(cate);
		for(EmallBrand l:cate){
			System.out.println(l);
			}
	}
	@Test
	public void fingByGmtCreateTest() throws Exception{
		String time="2013-09-11 15:38:43";
		Format f=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date d=(Date)f.parseObject(time);
		Timestamp ts=new Timestamp(d.getTime());
		List<EmallBrand> cate =BrandDao.fingByGmtCreate(ts);
		Assert.notNull(cate);
		System.out.println(cate);
		
	}
}