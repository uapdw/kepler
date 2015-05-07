package uap.web.ecmgr.ws;

import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springside.modules.test.category.UnStable;
import org.springside.modules.test.spring.SpringContextTestCase;

import uap.web.webservice.HelloWebService;

@Category(UnStable.class)
@DirtiesContext
@ContextConfiguration(locations = { "classpath:applicationContext.xml", "classpath:applicationContext-soap-client.xml","classpath:applicationContext-soap-server.xml" })
public class HelloWebServiceTest extends SpringContextTestCase{
	@Before
	public void setUp(){
		//System.setProperty("http.proxyHost", "127.0.0.1");
		//System.setProperty("http.proxyPort", "8888");
	}
	
	@Autowired
	HelloWebService helloWebServiceClient;

	@Test
	public void testHello(){
		helloWebServiceClient.sayHi();
	}
	
}
