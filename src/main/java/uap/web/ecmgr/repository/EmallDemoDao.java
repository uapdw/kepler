package uap.web.ecmgr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import uap.web.ecmgr.entity.EmallDemo;

public interface EmallDemoDao extends PagingAndSortingRepository<EmallDemo, Long> , JpaSpecificationExecutor<EmallDemo>{

	EmallDemo findByCode(String code);
	
	@Query("select d from EmallDemo d where code in (:codes)")
	List<EmallDemo> findByConditions(String[] codes);
	
	@Query("select max(demo.id)+1 from EmallDemo demo")
	long getNextId();
}
