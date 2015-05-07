package uap.web.ecmgr.service.emall;

import java.math.BigDecimal;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.spring.SpringTransactionalTestCase;

import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.service.emall.EmallGoodsService;

@ContextConfiguration(locations = { "/applicationContext.xml" })
public class EmallGoodsServicetTest extends SpringTransactionalTestCase {

	@Autowired
	private EmallGoodsService goodsService;

	@Test
	public void findById() throws Exception {
		EmallGood goods = goodsService.findById(10000L);
		System.out.print(goods);
	}

	@Test
	public void findByCatCode() throws Exception {
		List<EmallGood> goodsList = goodsService
				.findByCatCode("001.001.001.001");
		System.out.println(goodsList.size());
	}

	@Test
	public void findBySaleNumber() throws Exception {
		BigDecimal salenum = new BigDecimal("66");
		List<EmallGood> goodsList = goodsService.findBySaleNumber(salenum);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByTitle() throws Exception {
		List<EmallGood> goodsList = goodsService.findByTitle("田园");
		System.out.println(goodsList.size());
	}

	@Test
	public void findByMarketPrice() throws Exception {
		BigDecimal marketPrice = new BigDecimal("0.00");
		List<EmallGood> goodsList = goodsService.findByMarketPrice(marketPrice);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByGoodsPrice() throws Exception {
		BigDecimal goodsPrice = new BigDecimal("0.00");
		List<EmallGood> goodsList = goodsService.findByGoodsPrice(goodsPrice);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByGoodsNumber() throws Exception {
		BigDecimal goodsNumber = new BigDecimal("0.00");
		List<EmallGood> goodsList = goodsService.findByGoodsNumber(goodsNumber);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByGoodsStatus() throws Exception {
		List<EmallGood> goodsList = goodsService.findByGoodsStatus("on_sale");
		System.out.println(goodsList.size());
	}

	@Test
	public void findByGoodsRank() throws Exception {
		BigDecimal goodsRank = new BigDecimal("0");
		List<EmallGood> goodsList = goodsService.findByGoodsRank(goodsRank);
		System.out.println(goodsList.size());
	}

	@Test
	public void findByBrandId() throws Exception {
		BigDecimal brandId = new BigDecimal("72");
		List<EmallGood> goodsList = goodsService.findByBrandId(brandId);
		System.out.println(goodsList.size());
	}

	@Test
	public void findBySearchTag() throws Exception {
		List<EmallGood> goodsList = goodsService.findBySearchTag("浪漫");
		System.out.println(goodsList.size());
	}

	@Test
	public void findByShopCatId() throws Exception {
		List<EmallGood> goodsList = goodsService.findByShopCatId("1005");
		System.out.println(goodsList.size());
	}
}
