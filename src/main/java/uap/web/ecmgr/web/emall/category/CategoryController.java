package uap.web.ecmgr.web.emall.category;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.persistence.SearchFilter.Operator;

import uap.web.ecmgr.entity.EmallCategory;
import uap.web.ecmgr.service.emall.EmallCategoryService;

/**
 * 商品类目管理控制类，待考虑校验和异常处理、查询参数；Page对象待扩展
 * 
 * @author liujmc
 * @since 2015-01-19
 */
@Controller
@RequestMapping(value = "/emall/cat")
public class CategoryController {
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private EmallCategoryService cateService;
	
	@RequestMapping(value = "page", method = RequestMethod.GET)
	public @ResponseBody Page<EmallCategory> page(@RequestParam(value = "page", defaultValue = "1") int pageNumber, @RequestParam(value = "page.size", defaultValue = "10") int pageSize, @RequestParam(value = "sortType", defaultValue = "auto") String sortType, Model model, ServletRequest request) {
		// 待完善查询条件
		Map<String, Object> searchParams = new HashMap<String, Object>();
		String queryCon = request.getParameter("searchText");
		searchParams.put(Operator.LIKE + "_catName", queryCon);
		PageRequest pageRequest = buildPageRequest(pageNumber, pageSize, sortType);
		Page<EmallCategory> categoryPage = cateService.getCategoryPage(searchParams, pageRequest);
		return categoryPage;
	}
	
	/** 进入新增 */  
	@RequestMapping(value="create", method=RequestMethod.GET)  
	public @ResponseBody EmallCategory addCategory() { 
		EmallCategory category = new EmallCategory();
		return category;  
	}  
	
	/** 保存新增 */  
    @RequestMapping(value="create", method=RequestMethod.POST)  
    public @ResponseBody EmallCategory create(@RequestBody EmallCategory category, HttpServletRequest resq) {
    	try {
    		category = cateService.saveCategory(category);
		} catch (Exception e) {
			//记录日志
			logger.error("保存商品类目出错!",e);
		}
        return category;  
    }  
    
	/**
	 * 进入更新界面
	 * 
	 * @param id
	 * @param model
	 * @return 需要更新的实体的json结构
	 */
	@RequestMapping(value = "update/{id}", method = RequestMethod.GET)
	public @ResponseBody EmallCategory updateForm(@PathVariable("id") Long id, Model model) {
		EmallCategory category = cateService.getCategoryInfo(id);
		return category;
	}

	/** 保存更新 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public @ResponseBody EmallCategory update(@RequestBody EmallCategory category) {
    	try {
    		category = cateService.saveCategory(category);
		} catch (Exception e) {
			// 待记录日志
			e.printStackTrace();
		}
		return category;
	}

	/**
	 * 删除实体
	 * 
	 * @param id 删除的标识
	 * @return 是否删除成功
	 */
	@RequestMapping(value = "delete/{id}",method = RequestMethod.DELETE)
	public @ResponseBody boolean delete(@PathVariable("id") Long id) {
		cateService.deleteById(id);
		return true;
	}	
	
	@RequestMapping(value = "tree",method=RequestMethod.GET)
	public @ResponseBody List<EmallCategory> tree(@RequestParam(value = "parentNodeCode", defaultValue = "-1")String parentNodeCode) throws Exception{ 
		List<EmallCategory> cateList = cateService.getCateGorysByParent(parentNodeCode);
		return cateList;
	}
	
	/**
	 * 创建分页请求.
	 */
	private PageRequest buildPageRequest(int pageNumber, int pagzSize, String sortType) {
		Sort sort = null;
		if ("auto".equals(sortType)) {
			sort = new Sort(Direction.DESC, "id");
		} else if ("title".equals(sortType)) {
			sort = new Sort(Direction.ASC, "title");
		}
		return new PageRequest(pageNumber - 1, pagzSize, sort);
	}
	
}
