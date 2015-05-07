package uap.web.ecmgr.repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import uap.web.ecmgr.entity.EmallAttribute;
import uap.web.ecmgr.entity.EmallBrand;


public interface EmallBrandDao extends PagingAndSortingRepository<EmallBrand, Long>,JpaSpecificationExecutor<EmallBrand>{
     EmallBrand findById(Long id);
     
   @Query("SELECT brand FROM EmallBrand brand WHERE brand.brandName=?")
   List<EmallBrand> findByName(String brandName);
   
     List<EmallBrand> findByBrandPinyin(String brandPinyin);
     
     @Query("SELECT brand FROM EmallBrand brand WHERE brand.brandLogo=?")
    EmallBrand findByLogo(String brandLogo);
     
     @Query("SELECT brand FROM EmallBrand brand WHERE brand.sort = ?")
    List<EmallBrand> findBySort(BigDecimal sort);
     
     List<EmallBrand> findByLink(String link);
     
     @Query("SELECT brand FROM EmallBrand brand WHERE brand.isLocal=?")
    List<EmallBrand> findIsLocal(BigDecimal isLocal);
     
     List<EmallBrand> findByErpBrandId(String erpBrandId);
     
     @Query("SELECT brand FROM EmallBrand brand WHERE brand.gmtCreate=?")
    List<EmallBrand> fingByGmtCreate(Timestamp gmtCreate);
     @Query("select max(brand.id)+1 from EmallBrand brand")
 	long getNextId();
}
