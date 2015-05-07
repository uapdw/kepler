package uap.web.ecmgr.service.mgr;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
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
import org.springside.modules.persistence.SearchFilter.Operator;

import uap.web.ecmgr.entity.MgrFunction;
import uap.web.ecmgr.repository.MgrFunctionDao;
import uap.web.ecmgr.repository.MgrFunctionJdbcDao;

@Service
public class MgrFunctionService {

	@Autowired
	private MgrFunctionDao dao;
	
	@Autowired
	private MgrFunctionJdbcDao jdbcDao;
	
	public MgrFunction getFuncById(long id){
		return dao.findOne(id);
	}
	
	public void deleteById(Long id) {
		dao.delete(id);
	}
	
	@Transactional
	public MgrFunction saveEntity(MgrFunction entity) throws Exception{
		if(0 == entity.getId()){
			entity.setId(dao.getNextId());
			entity.setCreateDate(new Timestamp(System.currentTimeMillis()));
		}
		return dao.save(entity);
	}
	
	public Page<MgrFunction> getDemoPage(Map<String, Object> searchParams, PageRequest pageRequest) {
		Specification<MgrFunction> spec = buildSpecification(searchParams);
		return dao.findAll(spec, pageRequest);
	}
	
	public MgrFunction getFuncRoot(){
		Map<String, Object> searchParams = new HashMap<String, Object>();
		searchParams.put(Operator.EQ + "_isactive", "Y");
		Specification<MgrFunction> spec = buildSpecification(searchParams);
		List<MgrFunction> allFunc = dao.findAll(spec);
		
		MgrFunction root = getRootFunc(allFunc);
		initTree(root, allFunc);
		return root;
	}
	
	public MgrFunction getFuncRootByUser(long userId){
		List<MgrFunction> allFunc = jdbcDao.findAllFuncsByUserId(userId);
		MgrFunction root = getRootFunc(allFunc);
		initTree(root, allFunc);
		return root;
	}
	
	private void initTree(MgrFunction root, List<MgrFunction> allFunc) {
		List<MgrFunction> childList = getFuncsByParent(root, allFunc);
		root.setChildren(childList);
		for (int i = 0; i < childList.size(); i++) {
			initTree(childList.get(i),allFunc);
		}
	}

	private MgrFunction getRootFunc(List<MgrFunction> allFunc){
		for (int i = 0; i < allFunc.size(); i++) {
			if(-1 == allFunc.get(i).getParentId()){
				return allFunc.get(i);
			}
		}
		return null;
	}
	
	private List<MgrFunction> getFuncsByParent(MgrFunction pFunc, List<MgrFunction> allFunc){
		List<MgrFunction> childrenList = new ArrayList<MgrFunction>();
		for (int i = 0; i < allFunc.size(); i++) {
			if(pFunc.getId() == allFunc.get(i).getParentId()){
				MgrFunction f = allFunc.get(i);
//				MgrFunction cc = new MgrFunction();
//				cc.setFuncCode("mnmmm");;
//				cc.setFuncName("Test");;
//				cc.setFuncUrl("");
//				cc.setId(99);
//				cc.setParentId(f.getId());;
//				f.setChildren(new ArrayList<MgrFunction>());
//				f.getChildren().add(cc);
				childrenList.add(f);
				
//				break;// huoqi
			}
		}
		return childrenList;
	}
	
	/**
	 * 创建动态查询条件组合.
	 */
	public Specification<MgrFunction> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<MgrFunction> spec = DynamicSpecifications.bySearchFilter(filters.values(), MgrFunction.class);
		return spec;
	}

}
