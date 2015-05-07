package uap.web.ecmgr.repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import uap.web.ecmgr.entity.MgrFunction;

public interface MgrFunctionDao extends PagingAndSortingRepository<MgrFunction, Long> , JpaSpecificationExecutor<MgrFunction>{
	@Query("select max(func.id)+1 from MgrFunction func")
	long getNextId();
}
