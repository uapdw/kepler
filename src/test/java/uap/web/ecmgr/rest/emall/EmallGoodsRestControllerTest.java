package uap.web.ecmgr.rest.emall;

import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration(value = "src/main/webapp")
@ContextConfiguration(locations = { "classpath:applicationContext.xml",
		"file:src/main/webapp/WEB-INF/spring-mvc.xml" })
@TransactionConfiguration(defaultRollback = true)
@Transactional
public class EmallGoodsRestControllerTest {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = webAppContextSetup(this.wac).build();
	}

	@Test
	public void testget() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/emall/goods/page?page=1"))
				.andDo(MockMvcResultHandlers.print());
	}

	/*
	 * @Test public void testget() throws Exception {
	 * mockMvc.perform(MockMvcRequestBuilders
	 * .get("/goods")).andDo(MockMvcResultHandlers.print()); }
	 */

	@Test
	public void testTitlePost() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.post("/goods/title")
						.param("title", "浪漫")).andDo(
				MockMvcResultHandlers.print());
	}

	@Test
	public void testCatCodeGet() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/catcode").param("catCode",
						"004.004.001")).andDo(MockMvcResultHandlers.print());
	}

	@Test
	public void testSaleNumber() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/salenumber").param(
						"saleNumber", "66")).andDo(
				MockMvcResultHandlers.print());
	}

	@Test
	public void testMarketPrice() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/marketprice").param(
						"marketPrice", "0.00")).andDo(
				MockMvcResultHandlers.print());
	}

	@Test
	public void testGoodsPrice() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/goodsPrice").param(
						"goodsPrice", "0.00")).andDo(
				MockMvcResultHandlers.print());
	}

	@Test
	public void testGoodsStatus() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/goodsstatus").param(
						"goodsStatus", "on_sale")).andDo(
				MockMvcResultHandlers.print());
	}

	@Test
	public void testGoodsRank() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/goodsrank").param(
						"goodsRank", "0")).andDo(MockMvcResultHandlers.print());
	}

	@Test
	public void testBrandId() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/brandid").param("brandId",
						"72")).andDo(MockMvcResultHandlers.print());
	}

	@Test
	public void testSearchTag() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/searchtag").param(
						"searchTag", "浪漫"))
				.andDo(MockMvcResultHandlers.print());
	}

	@Test
	public void testShopCatId() throws Exception {
		mockMvc.perform(
				MockMvcRequestBuilders.get("/goods/shopcatid").param(
						"shopCatId", "1005")).andDo(
				MockMvcResultHandlers.print());
	}

}
