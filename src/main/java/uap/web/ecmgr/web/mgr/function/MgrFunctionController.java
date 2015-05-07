package uap.web.ecmgr.web.mgr.function;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Validator;

import org.apache.shiro.SecurityUtils;
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

import uap.web.ecmgr.entity.MgrFunction;
import uap.web.ecmgr.service.account.AccountService;
import uap.web.ecmgr.service.account.ShiroDbRealm.ShiroUser;
import uap.web.ecmgr.service.mgr.MgrFunctionService;
import uap.web.ecmgr.web.emall.BaseController;

@Controller
@RequestMapping(value = "/mgr/function")
public class MgrFunctionController extends BaseController{
private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private MgrFunctionService service;
	
	@Autowired
	private AccountService accountService;
	
	@Autowired
	private Validator validator;
	
	@RequestMapping(value = "page", method = RequestMethod.GET)
	public @ResponseBody Page<MgrFunction> page(@RequestParam(value = "page", defaultValue = "1") int pageNumber, @RequestParam(value = "page.size", defaultValue = "20") int pageSize, @RequestParam(value = "sortType", defaultValue = "auto") String sortType, Model model, ServletRequest request) {
		
		Map<String, Object> searchParams = new HashMap<String, Object>();
		String queryCon = request.getParameter("searchText");
		searchParams.put(Operator.LIKE + "_name", queryCon);
		
		PageRequest pageRequest = buildPageRequest(pageNumber, pageSize, sortType);
		
		Page<MgrFunction> categoryPage = service.getDemoPage(searchParams, pageRequest);
		return categoryPage;
	}
	
	/** 进入新增 */  
	@RequestMapping(value="create", method=RequestMethod.GET)  
	public @ResponseBody MgrFunction add() { 
		MgrFunction entity = new MgrFunction();
		return entity;  
	}  
	
	/** 保存新增 */  
    @RequestMapping(value="create", method=RequestMethod.POST)  
    public @ResponseBody MgrFunction create(@RequestBody MgrFunction entity, HttpServletRequest resq) {
    	
    	BeanValidators.validateWithException(validator, entity);
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
	public @ResponseBody MgrFunction updateForm(@PathVariable("id") Long id, Model model) {
		MgrFunction entity = service.getFuncById(id);
		return entity;
	}

	/** 保存更新 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public @ResponseBody MgrFunction update(@RequestBody MgrFunction entity) {
    	try {
    		entity = service.saveEntity(entity);
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
		service.deleteById(id);
		return true;
	}	
	
	
	@RequestMapping(value = "rootmenu", method = RequestMethod.GET)
	public @ResponseBody MgrFunction getRootMenu(Model model, HttpServletRequest request) {
		ShiroUser cuser = null;
		if(SecurityUtils.getSubject().getPrincipal()!=null)
			cuser = (ShiroUser)SecurityUtils.getSubject().getPrincipal();
		if(cuser == null){
			return null;
		}
		
		return service.getFuncRootByUser(cuser.id);
		
//		MgrFunction root = new MgrFunction();
//		root.setId(0);
//		root.setFuncCode("root");
//		root.setFuncName("root");
//		root.setFuncType("0");
//		root.setFuncUrl(null);
//		root.setParentId(-1);
//		root.setChildren(new ArrayList<MgrFunction>());
//		
//		MgrFunction m1 = new MgrFunction();
//		m1.setId(1);
//		m1.setFuncCode("m1");
//		m1.setFuncName("m1");
//		m1.setParentId(0);
//		m1.setFuncUrl("");
//		m1.setChildren(new ArrayList<MgrFunction>());
//		root.getChildren().add(m1);
//		
//		MgrFunction m2 = new MgrFunction();
//		m2.setId(2);
//		m2.setFuncCode("m2");
//		m2.setFuncName("m2");
//		m2.setParentId(1);
//		m2.setFuncUrl("");
//		m2.setChildren(new ArrayList<MgrFunction>());
//		m1.getChildren().add(m2);
//		
//		MgrFunction m3 = new MgrFunction();
//		m3.setId(3);
//		m3.setFuncCode("m3");
//		m3.setFuncName("m3");
//		m3.setParentId(2);
//		m3.setFuncUrl("");
//		m3.setChildren(new ArrayList<MgrFunction>());
//		m2.getChildren().add(m3);
//		
//		return root;
		
	}

}
