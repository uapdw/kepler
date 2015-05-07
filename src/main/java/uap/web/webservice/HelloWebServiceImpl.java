package uap.web.webservice;

import javax.jws.WebResult;

import org.springframework.beans.factory.annotation.Autowired;

import uap.web.ecmgr.entity.EmallDemo;
import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.service.emall.EmallDemoService;
import uap.web.ecmgr.service.emall.EmallGoodsService;

public class HelloWebServiceImpl implements HelloWebService {

	@Autowired
	EmallGoodsService service;
	
	@Autowired
	EmallDemoService demoService;
	
	@Override
	public @WebResult String sayHi() {
		return "Hello liujmc！";
	}

	@Override
	public EmallGood getEmallGoodById(Long id) {
		return service.findById(id);
	}

	@Override
	public EmallDemo getEmallDemoById(Long id) {
		return demoService.getEmallDemoById(id);
	}
}
