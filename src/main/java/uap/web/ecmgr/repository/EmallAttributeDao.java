package uap.web.ecmgr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import uap.web.ecmgr.entity.EmallAttribute;

public interface EmallAttributeDao extends PagingAndSortingRepository<EmallAttribute, Long>, JpaSpecificationExecutor<EmallAttribute> {

	//EmallAttribute findById(Long Id);

	List<EmallAttribute> findByAttrCode(String attrCode);

	List<EmallAttribute> findByAttrCodeLike(String attrCode);

	@Query("SELECT attr FROM EmallAttribute attr WHERE attr.attrName=?1")
	List<EmallAttribute> findByAttrName(String attrName);

	@Query("SELECT attr FROM EmallAttribute attr WHERE attr.attrName like ?1")
	List<EmallAttribute> findByAttrNameLike(String attrName);

	@Query("SELECT attr FROM EmallAttribute attr WHERE attr.attrCode = :attrCode and attr.attrName = :attrName")
	List<EmallAttribute> findByAttrNameAndCode(@Param("attrCode") String attrCode, @Param("attrName") String attrName);

	@Query("select max(attr.id)+1 from EmallAttribute attr")
	long getNextId();
}
