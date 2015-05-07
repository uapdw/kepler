package uap.web.ecmgr.web.emall.brand;

import java.math.BigDecimal;
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
import org.springframework.data.jpa.domain.Specification;
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
import uap.web.ecmgr.entity.EmallCategory;
import uap.web.ecmgr.service.emall.EmallBrandService;

@Controller
@RequestMapping(value = "/emall/brand")
public class BrandController {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private EmallBrandService brandservice;
	
	@RequestMapping(value = "brandname",method=RequestMethod.GET)
	public @ResponseBody List<EmallBrand> brandtreename(@RequestParam(value = "brandName", defaultValue = "CAV")String brandName) throws Exception{ 
		List<EmallBrand> cateList = brandservice.getBrankByName(brandName);
		return cateList;
	}
	@RequestMapping(value = "brandpinyin",method=RequestMethod.GET)
	public @ResponseBody List<EmallBrand> brandtreepinyin(@RequestParam(value = "brandpinyin", defaultValue = "y")String brandPinyin) throws Exception{ 
		List<EmallBrand> cateList = brandservice.getByBrandPinyin(brandPinyin);
		return cateList;
	}
	/** 进入新增 */ 
	@RequestMapping(value="create", method=RequestMethod.GET)  
	public @ResponseBody EmallBrand addbrand() { 
		EmallBrand brand = new EmallBrand();
		BigDecimal initValue = new BigDecimal(1);
		brand.setIsLocal(initValue);
		return brand;  
	} 
	/** 保存新增 */ 
	  @RequestMapping(value="create", method=RequestMethod.POST)  
	    public @ResponseBody EmallBrand create(@RequestBody EmallBrand brand, HttpServletRequest resq) {
	    	try {
	    		brand = brandservice.saveBrand(brand);
			} catch (Exception e) {
				// 待记录日志
				logger.error(e.getMessage());
			}
	        return brand;  
	    } 
	    
		/**
		 * 进入更新界面
		 * 
		 * @param id
		 * @param model
		 * @return 需要更新的实体的json结构
		 */
		@RequestMapping(value = "update/{id}", method = RequestMethod.GET)
		public @ResponseBody EmallBrand updateForm(@PathVariable("id") Long id, Model model) {
			EmallBrand brand = brandservice.getBrandInfo(id);
			return brand;
		}

		/** 保存更新 */
		@RequestMapping(value = "update", method = RequestMethod.POST)
		public @ResponseBody EmallBrand update(@RequestBody EmallBrand brand) {
	    	try {
	    		brand = brandservice.saveBrand(brand);
			} catch (Exception e) {
				// 待记录日志
				logger.error(e.getMessage());
			}
			return brand;
		}

		/**
		 * 删除实体
		 * 
		 * @param id 删除的标识
		 * @return 是否删除成功
		 */
		@RequestMapping(value = "delete/{id}",method = RequestMethod.DELETE)
		public @ResponseBody boolean delete(@PathVariable("id") Long id) {
			brandservice.deleteById(id);
			return true;
		}	
		
//		@RequestMapping(value = "tree",method=RequestMethod.GET)
//		public @ResponseBody List<EmallCategory> tree(@RequestParam(value = "parentNodeCode", defaultValue = "-1")String parentNodeCode) throws Exception{ 
//			List<EmallCategory> cateList = cateService.getCateGorysByParent(parentNodeCode);
//			return cateList;
//		}
	@RequestMapping(value = "page", method = RequestMethod.GET)
	public @ResponseBody Page<EmallBrand> page(@RequestParam(value = "page", defaultValue = "1") int pageNumber, @RequestParam(value = "page.size", defaultValue = "10") int pageSize, @RequestParam(value = "sortType", defaultValue = "auto") String sortType, Model model, ServletRequest request) {
		// 待完善查询条件
		Map<String, Object> searchParams = new HashMap<String, Object>();
		String queryCon = request.getParameter("searchText");
		searchParams.put(Operator.LIKE + "_brandName", queryCon);
		PageRequest pageRequest = buildPageRequest(pageNumber, pageSize, sortType);
		Page<EmallBrand> brandPage = brandservice.getBrnadPage(searchParams, pageRequest);
		return brandPage;
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
