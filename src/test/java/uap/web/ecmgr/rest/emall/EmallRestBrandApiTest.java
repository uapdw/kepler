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
@ContextConfiguration(locations = { "classpath:applicationContext.xml","file:src/main/webapp/WEB-INF/spring-mvc.xml" })
@TransactionConfiguration(defaultRollback = true)
@Transactional
public class EmallRestBrandApiTest {
	@Autowired
	private WebApplicationContext wac;

	private MockMvc mockMvc;
	@Before
	public void setup() {
		this.mockMvc = webAppContextSetup(this.wac).build();
	}
//	@Test  
//	public void testListname() throws Exception {  
//		 mockMvc.perform(MockMvcRequestBuilders.get("/emall/brand/brandname")).andDo(MockMvcResultHandlers.print());  
//	}
	@Test  
	public void testListpinyin() throws Exception {  
		 mockMvc.perform(MockMvcRequestBuilders.get("/emall/brand/page")).andDo(MockMvcResultHandlers.print());
	}
}
