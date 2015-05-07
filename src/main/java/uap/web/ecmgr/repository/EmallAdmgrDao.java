package uap.web.ecmgr.repository;


import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import uap.web.ecmgr.entity.EmallAdmgr;

public interface EmallAdmgrDao extends PagingAndSortingRepository<EmallAdmgr, Long> , JpaSpecificationExecutor<EmallAdmgr>{
	
	EmallAdmgr findById(long id);
	
	@Query("select ifnull(max(ad.id),0) + 1  from EmallAdmgr ad")
	long getNextId();	
}
