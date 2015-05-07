package uap.web.ecmgr.service.mgr;

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







import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.entity.MgrFunction;
import uap.web.ecmgr.entity.MgrRole;
import uap.web.ecmgr.repository.MgrRoleDao;

@Service
public class MgrRoleService {

	@Autowired
	private MgrRoleDao dao;
	
	public MgrRole findById(long id){
		return dao.findOne(id);
	}
	
	public List<MgrRole> findByName(String roleName){
		return dao.findByRoleName(roleName);
	}
	
	public List<MgrRole> findByCode(String roleCode){
		return dao.findByRole_code(roleCode);
	}
	
	public List<MgrRole> findByActive(String isactive){
		return dao.findByIsActive(isactive);
	}
	public void deleteById(Long id) {
		dao.delete(id);
	}
	
	@Transactional
	public MgrRole saveEntity(MgrRole role) throws Exception {
		if (0 == role.getId()) {
			role.setId(dao.getNextId());
		}
		return dao.save(role);
	}

	public Page<MgrRole> getRolePage(Map<String, Object> searchParams,
			PageRequest pageRequest) {
		Specification<MgrRole> spec = buildSpecification(searchParams);
		return dao.findAll(spec, pageRequest);
	}
	
	/**
	 * 创建动态查询条件组合.
	 */
	public Specification<MgrRole> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<MgrRole> spec = DynamicSpecifications.bySearchFilter(filters.values(), MgrRole.class);
		return spec;
	}
}
