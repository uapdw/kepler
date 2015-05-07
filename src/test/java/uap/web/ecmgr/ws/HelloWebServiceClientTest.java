package uap.web.ecmgr.ws;

import javax.xml.ws.BindingProvider;

import org.apache.cxf.endpoint.Client;
import org.apache.cxf.frontend.ClientProxy;
import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;
import org.apache.cxf.transport.http.HTTPConduit;
import org.apache.cxf.transports.http.configuration.HTTPClientPolicy;
import org.junit.Test;

import uap.web.ecmgr.entity.EmallDemo;
import uap.web.ecmgr.entity.EmallGood;
import uap.web.webservice.HelloWebService;

public class HelloWebServiceClientTest {
	public HelloWebService creatClient() {
		String address = "http://localhost:8081/ecmgr/cxf/soap/hellowebservice";

		JaxWsProxyFactoryBean proxyFactory = new JaxWsProxyFactoryBean();
		proxyFactory.setAddress(address);
		proxyFactory.setServiceClass(HelloWebService.class);
		HelloWebService accountWebServiceProxy = (HelloWebService) proxyFactory.create();

		// (可选)演示重新设定endpoint address.
		((BindingProvider) accountWebServiceProxy).getRequestContext().put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, address);

		// (可选)演示重新设定Timeout时间
		Client client = ClientProxy.getClient(accountWebServiceProxy);
		HTTPConduit conduit = (HTTPConduit) client.getConduit();
		HTTPClientPolicy policy = conduit.getClient();
		policy.setReceiveTimeout(600000);

		return accountWebServiceProxy;
	}

	@Test
	public void testGetGoods() {
		HelloWebService helloService = creatClient();
		EmallGood result = helloService.getEmallGoodById(10003L);
		System.out.println(result.getTitle());
	}
	
	@Test
	public void testGetDemo() {
		HelloWebService helloService = creatClient();
		EmallDemo result = helloService.getEmallDemoById(101L);
		System.out.println(result.getMemo());
	}
}
