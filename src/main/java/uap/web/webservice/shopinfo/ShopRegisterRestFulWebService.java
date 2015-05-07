package uap.web.webservice.shopinfo;

import java.math.BigDecimal;

import javax.jws.WebParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.web.MediaTypes;

import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.entity.EmallShopInfo;
import uap.web.ecmgr.service.emall.EmallShopInfoService;
import uap.web.mail.EmallMailService;

 
@Path(value = "/shopinfo")   
public class ShopRegisterRestFulWebService {
	
	private static Logger logger = LoggerFactory.getLogger(ShopRegisterRestFulWebService.class);
	
	@Autowired
	private EmallMailService mailService;
	
	@Autowired
	private EmallShopInfoService shopInfoService;
	
	@GET  
    @Path(value = "/test")  
	public Integer test(@PathParam(value="id") Long id){
		System.out.printf("testtest");
		return 1;
	}
	
	
	@GET  
    @Path(value = "/{id}.xml")  
	@Produces(MediaTypes.APPLICATION_XML_UTF_8)
	public EmallShopInfo getEmallDemoById(@PathParam(value="id") Long id){
		logger.info("restful webservice test...");
		return shopInfoService.getEmallShopById(id);
	}
	
	@GET  
    @Path(value = "/{id}.json")  
	@Produces(MediaTypes.JSON_UTF_8)
	public EmallShopInfo getEmallDemoJsonById(@PathParam(value="id") Long id){
		logger.info("restful webservice test...");
		return shopInfoService.getEmallShopById(id);
	}
	
	
	@POST
	@Path(value = "/register")
	@Consumes(value={"text/xml", "application/json"})
	public @ResponseBody int createDemo(@RequestBody  EmallShopInfo shopinfo){
		try {
			BigDecimal tmp=new BigDecimal(0);
			shopinfo.setId(0);
			shopinfo.setShopTitle(shopinfo.getShopTitle()==null?"测试注册商铺标题":shopinfo.getShopTitle());
			shopinfo.setShopName(shopinfo.getShopName()==null?"测试注册商铺名称":shopinfo.getShopName());
			shopinfo.setBackGoods7day(new BigDecimal(0));
			shopinfo.setShopLogo("file/down/image/1423634955722");
			shopinfo.setGoodsNoAuditing(new BigDecimal(0));
			shopinfo.setEmail("liujmc@yonyou.com");
			shopinfo.setPhone("62430508");
			shopinfo.setStatus("0");
			shopinfo.setIsDeleted("0");
			shopinfo.setUserId(new BigDecimal(0L));
			shopinfo.setBusProducts(shopinfo.getBusProducts()==null?"ordinary":shopinfo.getBusProducts());
			shopinfo.setCompanyName(shopinfo.getCompanyName()==null?"company":shopinfo.getCompanyName());
			shopinfo.setCustomerCode(shopinfo.getCustomerCode()==null?"10100":shopinfo.getCustomerCode());
			shopinfo.setGoodsNoAuditing(shopinfo.getGoodsNoAuditing()==null?tmp:shopinfo.getGoodsNoAuditing());

			shopInfoService.saveEntity(shopinfo);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("注册商铺失败!");
			return 0;
		}
		return 1;
	}

}
