package uap.web.ecmgr.service.emall;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.persistence.DynamicSpecifications;
import org.springside.modules.persistence.SearchFilter;

import uap.web.ecmgr.entity.EmallDemo;
import uap.web.ecmgr.repository.EmallDemoDao;

@Service
public class EmallDemoService {

	@Autowired
	private EmallDemoDao dao;
	
	public EmallDemo getEmallDemoById(long id){
		return dao.findOne(id);
	}
	
	public void deleteById(Long id) {
		dao.delete(id);
	}
	
	@Transactional
	public EmallDemo saveEntity(EmallDemo entity) throws Exception{
		if(0 == entity.getId()){
			entity.setId(dao.getNextId());
		}
		return dao.save(entity);
	}
	
	public Page<EmallDemo> getDemoPage(Map<String, Object> searchParams, PageRequest pageRequest) {
		Specification<EmallDemo> spec = buildSpecification(searchParams);
		return dao.findAll(spec, pageRequest);
	}
	
	/**
	 * 创建动态查询条件组合.
	 */
	public Specification<EmallDemo> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<EmallDemo> spec = DynamicSpecifications.bySearchFilter(filters.values(), EmallDemo.class);
		return spec;
	}

}
