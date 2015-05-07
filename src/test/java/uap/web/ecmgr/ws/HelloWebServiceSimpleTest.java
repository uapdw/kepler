package uap.web.ecmgr.ws;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

import java.io.IOException;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springside.modules.web.Servlets;

import uap.web.ecmgr.entity.EmallDemo;

import com.google.common.collect.Lists;


public class HelloWebServiceSimpleTest {
	private static String resourceUrl = "http://localhost:8081/ecmgr/cxf/jaxrs/demorestfulws";

	private RestTemplate jdkTemplate;
	private RestTemplate httpClientRestTemplate;
	private HttpComponentsClientHttpRequestFactory httpClientRequestFactory;
	
	@Before
	public void initRestTemplate() {
		// 默认使用JDK Connection
		jdkTemplate = new RestTemplate();
		// (optional)设置20秒超时
		((SimpleClientHttpRequestFactory) jdkTemplate.getRequestFactory()).setConnectTimeout(20000);
		((SimpleClientHttpRequestFactory) jdkTemplate.getRequestFactory()).setReadTimeout(20000);

		// 设置使用HttpClient4.0
		httpClientRestTemplate = new RestTemplate();
		httpClientRequestFactory = new HttpComponentsClientHttpRequestFactory();
		// (optional)设置20秒超时
		httpClientRequestFactory.setConnectTimeout(20000);

		httpClientRestTemplate.setRequestFactory(httpClientRequestFactory);

		// 设置处理HttpBasic Header的Interceptor
		ClientHttpRequestInterceptor interceptor = new HttpBasicInterceptor("admin", "admin");
		httpClientRestTemplate.setInterceptors(Lists.newArrayList(interceptor));
	}

	@After
	public void destoryClient() throws Exception {
		// 退出时关闭HttpClient4连接池中的连接
		httpClientRequestFactory.destroy();
	}
	
	/**
	 * 演示使用原始的exchange()方法来设置Headers.
	 * 演示xml格式数据.
	 * 演示jdk connection.
	 */
	@Test
	public void getDemoAsXML() {
		// 设置Http Basic参数
		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.set(com.google.common.net.HttpHeaders.AUTHORIZATION, Servlets.encodeHttpBasic("admin", "admin"));
		System.out.println("Http header is" + requestHeaders);
		HttpEntity<?> requestEntity = new HttpEntity(requestHeaders);

		try {
//			HttpEntity<EmallDemo> response = jdkTemplate.exchange(resourceUrl + "/{id}.xml", HttpMethod.GET, requestEntity, EmallDemo.class, 100L);
//			assertThat(response.getBody().getCode()).isEqualTo("code_1");

			// 直接取出XML串
			HttpEntity<String> xml = jdkTemplate.exchange(resourceUrl + "/{id}.xml", HttpMethod.GET, requestEntity, String.class, 1L);
			System.out.println("xml output is " + xml.getBody());
		} catch (HttpStatusCodeException e) {
			fail(e.getMessage());
		}
	}
	
	/**
	 * 处理HttpBasicHeader的Interceptor
	 */
	public static class HttpBasicInterceptor implements ClientHttpRequestInterceptor {

		private final String user;
		private final String password;

		public HttpBasicInterceptor(String user, String password) {
			this.user = user;
			this.password = password;
		}

		@Override
		public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
				throws IOException {
			request.getHeaders().set(com.google.common.net.HttpHeaders.AUTHORIZATION,
					Servlets.encodeHttpBasic(user, password));
			return execution.execute(request, body);
		}
	}
}
