package uap.web.ecmgr.repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.annotation.QueryAnnotation;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.entity.MgrAd;

public interface MgrAdDao extends PagingAndSortingRepository<MgrAd,Long>,JpaSpecificationExecutor<MgrAd> {
	
	MgrAd findById(long id);
	
	@Query("select max(ad.id)+1 from MgrAd ad")
	long getNextId();
	
	@Query("select max(ad.sort)+1 from MgrAd ad")
	BigDecimal getNextSort();
	
	@Query("SELECT g FROM MgrAd g WHERE g.type=?1")
	List<MgrAd> findByType(BigDecimal type);
	/*
	@Query("SELECT g FROM MgrAd g WHERE g.type=?1 limit 10")
	List<MgrAd> find10ByType(BigDecimal type);
	*/
	@Query("SELECT g FROM MgrAd g WHERE g.title=?1")
	List<MgrAd> findByTitle(String title);
	
	@Query("SELECT g FROM MgrAd g WHERE g.sort=?1")
	List<MgrAd> findBySort(BigDecimal sort);
	
	@Query("SELECT g FROM MgrAd g WHERE g.name=?1")
	List<MgrAd> findByName(String name);
	
	@Query("SELECT g FROM MgrAd g WHERE g.isActive=?1")
	List<MgrAd> findByIsActive(String isActive);
	
	@Query("SELECT g FROM MgrAd g WHERE g.create_date=?1")
	List<MgrAd> findByCreateTime(Timestamp create_date);
	
}