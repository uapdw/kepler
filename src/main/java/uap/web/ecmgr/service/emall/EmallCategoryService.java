package uap.web.ecmgr.service.emall;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.persistence.DynamicSpecifications;
import org.springside.modules.persistence.SearchFilter;

import uap.web.ecmgr.entity.EmallCategory;
import uap.web.ecmgr.repository.EmallCategoryDao;

@Service
public class EmallCategoryService {

	@Autowired
	private EmallCategoryDao cateDao;
	
	public EmallCategory getCategoryInfo(Long id) {
		return cateDao.findOne(id);
	}
	
	public void deleteById(Long id) {
		cateDao.delete(id);
	}
	
	@Transactional
	public List<EmallCategory> getCateGorysByParent(String parentCode) {
		return cateDao.findByParentCode(parentCode);
	}
	
	public Page<EmallCategory> getCategoryPage(Map<String, Object> searchParams, PageRequest pageRequest) {
		Specification<EmallCategory> spec = buildSpecification(searchParams);
		return cateDao.findAll(spec, pageRequest);
	}

	/**
	 * 创建动态查询条件组合.
	 */
	private Specification<EmallCategory> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<EmallCategory> spec = DynamicSpecifications.bySearchFilter(filters.values(), EmallCategory.class);
		return spec;
	}
	
	@Transactional
	public EmallCategory saveCategory(EmallCategory category) throws Exception{
		if(0 == category.getId()){
			category.setId(cateDao.getNextId());
		}
		return cateDao.save(category);
	}
	
}
