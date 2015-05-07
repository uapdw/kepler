package uap.web.ecmgr.web.emall.demo;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Validator;

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
import org.springside.modules.beanvalidator.BeanValidators;
import org.springside.modules.persistence.SearchFilter.Operator;

import uap.web.ecmgr.entity.EmallDemo;
import uap.web.ecmgr.service.emall.EmallDemoService;
import uap.web.ecmgr.web.emall.BaseController;

@Controller
@RequestMapping(value = "/emall/demo")
public class DemoController extends BaseController{
private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private EmallDemoService demoService;
	
	@Autowired
	private Validator validator;
	
	@RequestMapping(value = "page", method = RequestMethod.GET)
	public @ResponseBody Page<EmallDemo> page(@RequestParam(value = "page", defaultValue = "1") int pageNumber, @RequestParam(value = "page.size", defaultValue = "10") int pageSize, @RequestParam(value = "sortType", defaultValue = "auto") String sortType, Model model, ServletRequest request) {
		
		Map<String, Object> searchParams = new HashMap<String, Object>();
		String queryCon = request.getParameter("searchText");
		searchParams.put(Operator.LIKE + "_name", queryCon);
		
		PageRequest pageRequest = buildPageRequest(pageNumber, pageSize, sortType);
		
		Page<EmallDemo> categoryPage = demoService.getDemoPage(searchParams, pageRequest);
		return categoryPage;
	}
	
	/** 进入新增 */  
	@RequestMapping(value="create", method=RequestMethod.GET)  
	public @ResponseBody EmallDemo add() { 
		EmallDemo entity = new EmallDemo();
		return entity;  
	}  
	
	/** 保存新增 */  
    @RequestMapping(value="create", method=RequestMethod.POST)  
    public @ResponseBody EmallDemo create(@RequestBody EmallDemo entity, HttpServletRequest resq) {
    	
    	BeanValidators.validateWithException(validator, entity);
    	try {
    		entity = demoService.saveEntity(entity);
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
	public @ResponseBody EmallDemo updateForm(@PathVariable("id") Long id, Model model) {
		EmallDemo entity = demoService.getEmallDemoById(id);
		return entity;
	}

	/** 保存更新 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public @ResponseBody EmallDemo update(@RequestBody EmallDemo entity) {
    	try {
    		entity = demoService.saveEntity(entity);
		} catch (Exception e) {
			logger.error("更新出错!",e);
		}
		return entity;
	}

	/**
	 * 删除实体
	 * 
	 * @param id 删除的标识
	 * @return 是否删除成功
	 */
	@RequestMapping(value = "delete/{id}",method = RequestMethod.DELETE)
	public @ResponseBody boolean delete(@PathVariable("id") Long id) {
		demoService.deleteById(id);
		return true;
	}	

}
