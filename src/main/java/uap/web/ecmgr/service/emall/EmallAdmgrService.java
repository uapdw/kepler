package uap.web.ecmgr.service.emall;

import java.math.BigDecimal;
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

import uap.web.ecmgr.entity.EmallAdmgr;
import uap.web.ecmgr.repository.EmallAdmgrDao;


@Service
public class EmallAdmgrService {

	@Autowired
	private EmallAdmgrDao adDao;


	public EmallAdmgr findById(Long id) {
		return adDao.findById(id);
	}

	public EmallAdmgr getAdmgrInfo(Long id) {
		return adDao.findOne(id);
	}

	public void deleteById(Long id) {
		adDao.delete(id);
	}

	public Page<EmallAdmgr> getAdmgrPage(Map<String, Object> searchParams,
			PageRequest pageRequest) {
		Specification<EmallAdmgr> spec = buildSpecification(searchParams);
		return adDao.findAll(spec, pageRequest);
	}

	@Transactional
	public EmallAdmgr saveAdmgr(EmallAdmgr admgr) throws Exception {
		if (0 == admgr.getId()) {
			admgr.setId(adDao.getNextId());
		}
		return adDao.save(admgr);
	}

	/**
	 * 创建动态查询条件组合.
	 */
	private Specification<EmallAdmgr> buildSpecification(
			Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<EmallAdmgr> spec = DynamicSpecifications.bySearchFilter(
				filters.values(), EmallAdmgr.class);
		return spec;
	}

}
