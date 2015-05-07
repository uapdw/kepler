package uap.web.ecmgr.service.emall;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.junit.Test;

public class HttpClientTest {

	@Test
	public void testHttpClientGet() throws ClientProtocolException, IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpGet httpget = new HttpGet("http://www.baidu.com");
		// httpget.addHeader(new BasicHeader("", ""));
		// httpget.addHeader("", "");
		CloseableHttpResponse httpReponse = httpClient.execute(httpget);
		try {
			// 获取状态行
			System.out.println(httpReponse.getStatusLine());
			HttpEntity entity = httpReponse.getEntity();
			// 返回内容
			System.out.println(EntityUtils.toString(entity));
		} finally {
			httpReponse.close();
		}
	}

	@Test
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void testHttpClientPost() throws ParseException, IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost("http://localhost:8081/ecmgr/login");

		List Listnvps = new ArrayList();
		Listnvps.add(new BasicNameValuePair("username", "admin"));
		Listnvps.add(new BasicNameValuePair("password", "admin"));

		httpPost.setEntity(new UrlEncodedFormEntity(Listnvps));
		CloseableHttpResponse httppHttpResponse = httpClient.execute(httpPost);
		try {
			System.out.println(httppHttpResponse.getStatusLine());
			System.out.println(EntityUtils.toString(httppHttpResponse.getEntity()));
		} finally {
			httppHttpResponse.close();
		}
		httpClient.close();
	}

	@Test
	public void testClient() {
		// 创建HttpClientBuilder
		HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
		// HttpClient
		CloseableHttpClient closeableHttpClient = httpClientBuilder.build();

		HttpGet httpGet = new HttpGet("http://www.gxnu.edu.cn/default.html");
		System.out.println(httpGet.getRequestLine());
		try {
			// 执行get请求
			HttpResponse httpResponse = closeableHttpClient.execute(httpGet);
			// 获取响应消息实体
			HttpEntity entity = httpResponse.getEntity();
			// 响应状态
			System.out.println("status:" + httpResponse.getStatusLine());
			// 判断响应实体是否为空
			if (entity != null) {
				System.out.println("contentEncoding:" + entity.getContentEncoding());
				System.out.println("response content:" + EntityUtils.toString(entity));
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				// 关闭流并释放资源
				closeableHttpClient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
