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

import uap.web.ecmgr.entity.EmallShopInfo;
import uap.web.ecmgr.repository.EmallShopInfoDao;

@Service
public class EmallShopInfoService {
	@Autowired
	private EmallShopInfoDao dao;
	
	public EmallShopInfo getEmallShopById(long id){
		return dao.findOne(id);
	}
	
	public void deleteById(Long id) {
		dao.delete(id);
	}
	
	@Transactional
	public EmallShopInfo saveEntity(EmallShopInfo entity) throws Exception{
		if(0 == entity.getId()){
			entity.setId(dao.getNextId());
		}
		return dao.save(entity);
	}
	
	public Page<EmallShopInfo> getshopPage(Map<String, Object> searchParams, PageRequest pageRequest) {
		Specification<EmallShopInfo> spec = buildSpecification(searchParams);
		return dao.findAll(spec, pageRequest);
	}
	
	/**
	 * 创建动态查询条件组合.
	 */
	public Specification<EmallShopInfo> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<EmallShopInfo> spec = DynamicSpecifications.bySearchFilter(filters.values(), EmallShopInfo.class);
		return spec;
	}
}
