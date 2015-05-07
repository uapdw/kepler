package uap.web.ecmgr.service.emall;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springside.modules.persistence.DynamicSpecifications;
import org.springside.modules.persistence.SearchFilter;

import uap.web.ecmgr.entity.EmallAttribute;
import uap.web.ecmgr.repository.EmallAttributeDao;

@Service
public class EmallAttributeService {

	@Autowired
	private EmallAttributeDao attrDao;

	public void deleteById(Long id) {
		attrDao.delete(id);
	}

	/**
	 * 根据id查找一条记录
	 * 
	 * @param id
	 * @return
	 */
	public EmallAttribute getAttributeInfo(Long id) {
		return attrDao.findOne(id);
	}

	public List<EmallAttribute> findByAttrCode(String attrCode) {
		return attrDao.findByAttrCode(attrCode);
	}

	public List<EmallAttribute> findByAttrCodeLike(String attrCode) {
		return attrDao.findByAttrCodeLike(attrCode);
	}

	public List<EmallAttribute> findByAttrName(String attrName) {
		List<EmallAttribute> attrs = attrDao.findByAttrName(attrName);
		return attrs;
	}

	public List<EmallAttribute> findByAttrNameLike(String attrCode) {
		return attrDao.findByAttrNameLike(attrCode);
	}

	/**
	 * 
	 * @param searchParams
	 * @param pageRequest
	 * @return
	 */
	public Page<EmallAttribute> getAttributePage(Map<String, Object> searchParams, PageRequest pageRequest) {
		Specification<EmallAttribute> spec = buildSpecification(searchParams);
		return attrDao.findAll(spec, pageRequest);
	}

	/**
	 * 创建动态查询条件组合.
	 * 
	 * @param searchParams
	 * @return
	 */
	private Specification<EmallAttribute> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<EmallAttribute> spec = DynamicSpecifications.bySearchFilter(filters.values(), EmallAttribute.class);
		return spec;
	}

	/**
	 * 保存一条属性
	 * 
	 * @param attribute
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public EmallAttribute saveAttribute(EmallAttribute attribute) throws Exception {
		if (0 == attribute.getId()) {
			attribute.setId(attrDao.getNextId());
		}
		return attrDao.save(attribute);
	}

}
