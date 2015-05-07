package uap.web.ecmgr.service.mgr;

import java.math.BigDecimal;
import java.sql.Timestamp;
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

import uap.web.ecmgr.entity.MgrAd;
import uap.web.ecmgr.repository.MgrAdDao;
import uap.web.ecmgr.repository.MgrAdJdbcDao;

@Service
public class MgrAdService {
	@Autowired
	private MgrAdDao dao;
	@Autowired
	private MgrAdJdbcDao Jdbcdao;
	
	public MgrAd findById(long id){
		return dao.findById(id);
	}
	
	public List<MgrAd> findByType(BigDecimal type){
		return dao.findByType(type);
	}
	public List<MgrAd> find10ByType(BigDecimal type){
		return Jdbcdao.find10ByType(type);
	}
	
	public List<MgrAd> findByTitle(String title){
		return dao.findByTitle(title);
	}
	
	public List<MgrAd> findBySort(BigDecimal sort){
		return dao.findBySort(sort);
	}
	
	public List<MgrAd> findByName(String name){
		return dao.findByName(name);
	}
	public List<MgrAd> findByIsActive(String isActive){
		return dao.findByIsActive(isActive);
	}
	
	public List<MgrAd> findByCreateTime(Timestamp create_date){
		return dao.findByCreateTime(create_date);
	}
	
	public void deleteById(Long id) {
		dao.delete(id);
	}
	
	@Transactional
	public MgrAd saveEntity(MgrAd ad) throws Exception {
		if (0 == ad.getId()) {
			ad.setId(dao.getNextId());
			ad.setSort(dao.getNextSort());
		}
		return dao.save(ad);
	}
	
	public Page<MgrAd> getAdPage(Map<String, Object> searchParams,PageRequest pageRequest) {
		Specification<MgrAd> spec = buildSpecification(searchParams);
		return dao.findAll(spec, pageRequest);
	}
	
	/**
	 * 创建动态查询条件组合.
	 */
	public Specification<MgrAd> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<MgrAd> spec = DynamicSpecifications.bySearchFilter(filters.values(), MgrAd.class);
		return spec;
	}
}
