package uap.web.ecmgr.web.mgr.ad;

import java.math.BigDecimal;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.net.ntp.TimeStamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.persistence.SearchFilter.Operator;

import uap.web.ecmgr.entity.EmallBrand;
import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.entity.EmallShopInfo;
import uap.web.ecmgr.entity.MgrAd;
import uap.web.ecmgr.service.emall.EmallBrandService;
import uap.web.ecmgr.service.emall.EmallGoodsService;
import uap.web.ecmgr.service.emall.EmallShopInfoService;
import uap.web.ecmgr.service.mgr.MgrAdService;
import uap.web.ecmgr.web.emall.BaseController;

@Controller
@RequestMapping(value = "/mgr/advert")
public class MgrAdController extends BaseController{
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private MgrAdService service;
	
	@Autowired
	private EmallGoodsService goodservice;
	
	@Autowired
	private EmallBrandService brandservice;
	
	@Autowired
	private EmallShopInfoService shopservice;
	
	@RequestMapping(value = "page", method = RequestMethod.GET)
	public @ResponseBody Page<MgrAd> page(
			@RequestParam(value = "page", defaultValue = "1") int pageNumber, 
			@RequestParam(value = "page.size", defaultValue = "10") int pageSize, 
			@RequestParam(value = "sortType", defaultValue = "auto") String sortType, 
			Model model, ServletRequest request) {
		
		Map<String, Object> searchParams = new HashMap<String, Object>();
		

		String a = request.getParameter("isactive");
		String b = request.getParameter("title");
		String c = request.getParameter("name");
		String d = request.getParameter("type");
		
		searchParams.put(Operator.LIKE + "_isActive", a);
		searchParams.put(Operator.LIKE + "_title", b);
		searchParams.put(Operator.LIKE + "_name", c);
		searchParams.put(Operator.EQ + "_type", d);
	
		
		PageRequest pageRequest = buildPageRequest(pageNumber, pageSize, sortType);
		
		Page<MgrAd> adPage = service.getAdPage(searchParams, pageRequest);
		return adPage;
	}
	
	/** 进入新增 */  
	@RequestMapping(value="create", method=RequestMethod.GET)  
	public @ResponseBody MgrAd add() { 
		MgrAd entity = new MgrAd();
		return entity;  
	}  
	
	/** 保存新增 */  
    @RequestMapping(value="create", method=RequestMethod.POST)  
    public @ResponseBody MgrAd create(@RequestBody MgrAd entity, HttpServletRequest resq) {
    	
    	try {
    		entity = service.saveEntity(entity);
		} catch (Exception e) {
			//记录日志
			logger.error("保存出错!",e);
		}
        return entity;  
    }  
    
    /**
	 * 进入更新界面
	 * 
	 * @param id
	 * @param model
	 * @return 需要更新的实体的json结构
	 */
	@RequestMapping(value = "update/{id}", method = RequestMethod.GET)
	public @ResponseBody MgrAd updateForm(@PathVariable("id") Long id, Model model) {
		MgrAd entity = service.findById(id);
		return entity;
	}

	/** 保存更新 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public @ResponseBody MgrAd update(@RequestBody MgrAd entity) {
    	try {
    		entity = service.saveEntity(entity);
		} catch (Exception e) {
			logger.error("更新出错!",e);
		}
		return entity;
	}

	/** 保存审核*/
	@RequestMapping(value = "approve/{id}", method = RequestMethod.POST)
	public @ResponseBody boolean approve(@RequestBody MgrAd entity){
		try {
			service.saveEntity(entity);
		} catch (Exception e) {
			// 记录日志
			logger.error("审批出错!", e);
			return false;
		}
		return true;
	}
	
	/** 添加推荐*/
	@RequestMapping(value = "recommend/{id}", method = RequestMethod.GET)
	public @ResponseBody boolean recommend(@PathVariable("id") Long id,
			ServletRequest request){
		
		String typecode = request.getParameter("type");
		BigDecimal type=new BigDecimal(typecode);
		MgrAd entity = new MgrAd();
		Timestamp createtime=new Timestamp(System.currentTimeMillis());
		entity.setId(0);
		entity.setBusinessId(id.toString());
		entity.setIsActive("N");
		entity.setCreatetime(createtime);
		entity.setType(type);
		try {
			switch (Integer.parseInt(typecode)) {
			case 1:
				//shop
				EmallShopInfo shop=shopservice.getEmallShopById(id);
				
				entity.setImage(shop.getShopLogo());
				entity.setName(shop.getShopName());
				entity.setTitle(shop.getShopTitle());
				break;
			case 2:
				//goods
				EmallGood good = goodservice.findById(id);
		
				entity.setImage(good.getImgLarge());
				entity.setName(good.getTitle());
				entity.setTitle(good.getTitle());							
				break;
			case 3:
				//brand
				EmallBrand brand=brandservice.getbrandinfo(id);

				entity.setImage(brand.getBrandLogo());
				entity.setName(brand.getBrandName());
				entity.setTitle(brand.getBrandName());	
				break;
			}

			service.saveEntity(entity);
		} catch (Exception e) {
			// 记录日志
			logger.error("审批出错!", e);
			return false;
		}
		return true;
	}
	
	/** 快速通过*/
	@RequestMapping(value = "fastcheck/{id}", method = RequestMethod.GET)
	public @ResponseBody boolean fastcheck(@PathVariable("id") Long id){
		try {
			MgrAd entity = service.findById(id);
			entity.setIsActive("Y");
			service.saveEntity(entity);
		} catch (Exception e) {
			// 记录日志
			logger.error("审批出错!", e);
			return false;
		}
		return true;
	}
	
	/**
	 * 删除实体
	 * 
	 * @param id 删除的标识
	 * @return 是否删除成功
	 */
	@RequestMapping(value = "delete/{id}",method = RequestMethod.DELETE)
	public @ResponseBody boolean delete(@PathVariable("id") Long id) {
		service.deleteById(id);
		return true;
	}
	
}
