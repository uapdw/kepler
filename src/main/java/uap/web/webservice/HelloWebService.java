package uap.web.webservice;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;

import uap.web.ecmgr.entity.EmallDemo;
import uap.web.ecmgr.entity.EmallGood;

@WebService(name = "hellowebservice")
public interface HelloWebService {
	
	 @WebMethod  
	 @WebResult String sayHi();
	 
	 @WebMethod
	 @WebResult EmallGood getEmallGoodById(@WebParam(name = "id") Long id);
	 
	 @WebMethod
	 @WebResult EmallDemo getEmallDemoById(@WebParam(name = "id") Long id);

}
