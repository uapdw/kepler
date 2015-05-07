/*******************************************************************************
 * Copyright (c) 2005, 2014 springside.github.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *******************************************************************************/
package uap.web.ecmgr.ws;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import uap.web.ecmgr.entity.EmallDemo;

/**
 * 对基于JAX-RS的实现Restful的测试
 * 
 * @author calvin
 */
public class DemoJaxRsFT {

	private static String resourceUrl = "http://localhost:8081/ecmgr/cxf/jaxrs/demorestfulws";

	private RestTemplate restTemplate = new RestTemplate();

	@Test
	public void getUser() {
		EmallDemo demo = restTemplate.getForObject(resourceUrl + "/102.xml", EmallDemo.class, 1L);
		assertThat(demo.getCode()).isEqualTo("code_0");
	}
	
	@Test
	public void saveDemo() {
		
	     
		EmallDemo demo = new EmallDemo();
		demo.setCode("mycode");
		demo.setIsdefault("Y");
		demo.setMemo("memo");
		demo.setName("myname");
		HttpHeaders headers =new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity request=new HttpEntity(demo, headers);
		
		long result = restTemplate.postForObject(resourceUrl + "/save", request, Long.class, demo);
		System.out.println(result);
	}
}
