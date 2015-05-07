package uap.web.ecmgr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import uap.web.ecmgr.entity.EmallCategory;


public interface EmallCategoryDao extends PagingAndSortingRepository<EmallCategory, Long> , JpaSpecificationExecutor<EmallCategory>{
	
	EmallCategory findById(long id);
	
	EmallCategory findByCatCode(String catCode);
	
	List<EmallCategory> findByParentCode(String parentCode);
	
	List<EmallCategory> findByCatCodeLike(String catCode);
	
	@Query("select max(cat.id)+1 from EmallCategory cat")
	long getNextId();
	
}
