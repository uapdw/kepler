package uap.web.ecmgr.repository.emall;

import java.util.List;
import java.math.BigDecimal;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.EmallAttribute;
import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.entity.EmallGoodsAttr;
import uap.web.ecmgr.repository.EmallGoodsDao;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class EmallGoodsDaoTest extends SpringTransactionalTestCase {

	@Autowired
	private EmallGoodsDao dao;

	@Test
	public void findById() throws Exception {
		EmallGood goods = dao.findById(10000L);
		System.out.print(goods);
	}

	@Test
	public void findByCatCode() throws Exception {
		List<EmallGood> goodsList = dao.findByCatCode("001.001.001.001");
		System.out.println(goodsList.size());
	}

	@Test
	public void findBySaleNumber() throws Exception {
		BigDecimal salenum = new BigDecimal("66");
		List<EmallGood> goodsList = dao.findBySaleNumber(salenum);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByTitle() throws Exception {
		List<EmallGood> goodsList = dao.findByTitle("田园");
		System.out.println(goodsList.size());
	}

	@Test
	public void findByMarketPrice() throws Exception {
		BigDecimal marketPrice = new BigDecimal("0.00");
		List<EmallGood> goodsList = dao.findByMarketPrice(marketPrice);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByGoodsPrice() throws Exception {
		BigDecimal goodsPrice = new BigDecimal("0.00");
		List<EmallGood> goodsList = dao.findByGoodsPrice(goodsPrice);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByGoodsNumber() throws Exception {
		BigDecimal goodsNumber = new BigDecimal("0.00");
		List<EmallGood> goodsList = dao.findByGoodsNumber(goodsNumber);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByGoodsStatus() throws Exception {
		List<EmallGood> goodsList = dao.findByGoodsStatus("on_sale");
		System.out.println(goodsList.size());
	}

	@Test
	public void findByGoodsRank() throws Exception {
		BigDecimal goodsrank = new BigDecimal("0");
		List<EmallGood> goodsList = dao.findByGoodsRank(goodsrank);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByBrandId() throws Exception {
		BigDecimal brandId = new BigDecimal("72");
		List<EmallGood> goodsList = dao.findByBrandId(brandId);
		System.out.println(goodsList.size());
	}

	@Test
	public void findBySearchTag() throws Exception {
		List<EmallGood> goodsList = dao.findBySearchTag("浪漫");
		System.out.println(goodsList.size());
	}

	@Test
	public void findByShopCatId() throws Exception {
		List<EmallGood> goodsList = dao.findByShopCatId("1005");
		System.out.println(goodsList.size());
	}
	
/*	@Test
	public void findAttrByGood() throws Exception {
		EmallGood goods = dao.findById(10001L);
		List<EmallGoodsAttr> attrList = goods.getAttr();
		for (EmallGoodsAttr e : attrList) {
			System.out.println(e.getGoodsId() + "\n");
		}
		System.out.println(attrList.size());
	}*/
	 
}
