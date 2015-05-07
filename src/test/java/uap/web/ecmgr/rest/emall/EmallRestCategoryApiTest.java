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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.result.StatusResultMatchers;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration(value = "src/main/webapp")
@ContextConfiguration(locations = { "classpath:applicationContext.xml","file:src/main/webapp/WEB-INF/spring-mvc.xml" })
@TransactionConfiguration(defaultRollback = true)
@Transactional
public class EmallRestCategoryApiTest {

	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		this.mockMvc = webAppContextSetup(this.wac).build();
	}
	
	@Test  
	public void testList() throws Exception {  
		 mockMvc.perform(MockMvcRequestBuilders.get("/emall/cat/tree")).andDo(MockMvcResultHandlers.print());  
	}
	
	@Test  
	public void testPage() throws Exception {  
		 mockMvc.perform(MockMvcRequestBuilders.get("/emall/cat/page")).andDo(MockMvcResultHandlers.print());  
	}
	
//	@Test  
//  public void testSave() throws Exception {  
//       mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/category/10000")).andDo(MockMvcResultHandlers.print());  
//  }
	
	/*
	@Test
	public void testa() throws Exception {
	 MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/user/1"))  
	            .andExpect(MockMvcResultMatchers.view().name("user/view"))  
	            .andExpect(MockMvcResultMatchers.model().attributeExists("user"))  
	            .andDo(MockMvcResultHandlers.print())  
	            .andReturn();  
	      
	    Assert.notNull(result.getModelAndView().getModel().get("user"));  
	}

	@Test
	public void testb() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/spring/test.do"))
		.andExpect(status().isOk())
		.andExpect(MockMvcResultMatchers.model().attributeExists("user"))
		.andDo(MockMvcResultHandlers.print());
	}

	@Test
	public void testc() throws Exception {
		mockMvc.perform((get("/spring/testb.do"))).andExpect(status().isOk())
		.andDo(print());
	}

	@Test
	public void testd() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/spring/post.do").param("abc", "def"))
		.andExpect(status().isOk()).andDo(MockMvcResultHandlers.print());
	}
	*/
	
}
