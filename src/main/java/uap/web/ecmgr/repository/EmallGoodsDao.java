package uap.web.ecmgr.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import uap.web.ecmgr.entity.EmallCategory;
import uap.web.ecmgr.entity.EmallGood;

public interface EmallGoodsDao extends
		PagingAndSortingRepository<EmallGood, Long>,
		JpaSpecificationExecutor<EmallGood> {

	EmallGood findById(long id);

	@Query("SELECT g FROM EmallGood g WHERE g.catCode=?1")
	List<EmallGood> findByCatCode(String catCode);

	@Query("SELECT g FROM EmallGood g WHERE g.saleNumber=?1")
	List<EmallGood> findBySaleNumber(BigDecimal saleNumber);

	@Query("SELECT g FROM EmallGood g WHERE g.title like %?1%")
	List<EmallGood> findByTitle(String title);

	@Query("SELECT g FROM EmallGood g WHERE g.marketPrice=?1")
	List<EmallGood> findByMarketPrice(BigDecimal marketPrice);

	@Query("SELECT g FROM EmallGood g WHERE g.goodsPrice=?1")
	List<EmallGood> findByGoodsPrice(BigDecimal goodsPrice);

	@Query("SELECT g FROM EmallGood g WHERE g.goodsNumber=?1")
	List<EmallGood> findByGoodsNumber(BigDecimal goodsNumber);

	@Query("SELECT g FROM EmallGood g WHERE g.goodsStatus=?1")
	List<EmallGood> findByGoodsStatus(String goodsStatus);

	@Query("SELECT g FROM EmallGood g WHERE g.goodsRank=?1")
	List<EmallGood> findByGoodsRank(BigDecimal goodsRank);

	@Query("SELECT g FROM EmallGood g WHERE g.brandId=?1")
	List<EmallGood> findByBrandId(BigDecimal brandId);

	@Query("SELECT g FROM EmallGood g WHERE g.searchTag like %?1%")
	List<EmallGood> findBySearchTag(String searchTag);

	@Query("SELECT g FROM EmallGood g WHERE g.shopCatId like %?1%")
	List<EmallGood> findByShopCatId(String shopCatId);

	@Query("select max(good.id)+1 from EmallGood good")
	long getNextId();
}
