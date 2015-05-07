package uap.web.ecmgr.web.mgr.role;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

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
import uap.web.ecmgr.entity.MgrRole;
import uap.web.ecmgr.service.mgr.MgrFunctionService;
import uap.web.ecmgr.service.mgr.MgrRoleService;
import uap.web.ecmgr.web.emall.BaseController;

@Controller
@RequestMapping(value = "/mgr/role")
public class MgrRoleController extends BaseController{
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private MgrRoleService service;
	
	@RequestMapping(value = "page", method = RequestMethod.GET)
	public @ResponseBody Page<MgrRole> page(@RequestParam(value = "page", defaultValue = "1") int pageNumber, @RequestParam(value = "page.size", defaultValue = "20") int pageSize, @RequestParam(value = "sortType", defaultValue = "auto") String sortType, Model model, ServletRequest request) {
		
		Map<String, Object> searchParams = new HashMap<String, Object>();
		String queryCon = request.getParameter("searchText");
		searchParams.put(Operator.LIKE + "_roleName", queryCon);
		
		PageRequest pageRequest = buildPageRequest(pageNumber, pageSize, sortType);
		
		Page<MgrRole> rolePage = service.getRolePage(searchParams, pageRequest);
		return rolePage;
	}
	
	
	/** 进入新增 */  
	@RequestMapping(value="create", method=RequestMethod.GET)  
	public @ResponseBody MgrRole add() { 
		MgrRole entity = new MgrRole();
		return entity;  
	}  
	
	/** 保存新增 */  
    @RequestMapping(value="create", method=RequestMethod.POST)  
    public @ResponseBody MgrRole create(@RequestBody MgrRole entity, HttpServletRequest resq) {
    	
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
	public @ResponseBody MgrRole updateForm(@PathVariable("id") Long id, Model model) {
		MgrRole entity = service.findById(id);
		return entity;
	}

	/** 保存更新 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public @ResponseBody MgrRole update(@RequestBody MgrRole entity) {
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
	
}
