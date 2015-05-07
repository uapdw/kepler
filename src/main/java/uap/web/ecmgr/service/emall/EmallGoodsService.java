package uap.web.ecmgr.service.emall;

import java.math.BigDecimal;
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

import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.repository.EmallGoodsDao;

@Service
public class EmallGoodsService {

	@Autowired
	private EmallGoodsDao goodDao;

	public EmallGood findById(Long id) {
		return goodDao.findById(id);
	}

	public List<EmallGood> findByCatCode(String catCode) {
		return goodDao.findByCatCode(catCode);
	}

	public List<EmallGood> findBySaleNumber(BigDecimal saleNumber) {
		return goodDao.findBySaleNumber(saleNumber);
	}

	public List<EmallGood> findByTitle(String title) {
		return goodDao.findByTitle(title);
	}

	public List<EmallGood> findByMarketPrice(BigDecimal marketPrice) {
		return goodDao.findByMarketPrice(marketPrice);
	}

	public List<EmallGood> findByGoodsPrice(BigDecimal goodsPrice) {
		return goodDao.findByGoodsPrice(goodsPrice);
	}

	public List<EmallGood> findByGoodsNumber(BigDecimal goodsNumber) {
		return goodDao.findByGoodsNumber(goodsNumber);
	}

	public List<EmallGood> findByGoodsStatus(String goodsStatus) {
		return goodDao.findByGoodsStatus(goodsStatus);
	}

	public List<EmallGood> findByGoodsRank(BigDecimal goodsRank) {
		return goodDao.findByGoodsRank(goodsRank);
	}

	public List<EmallGood> findByBrandId(BigDecimal brandId) {
		return goodDao.findByBrandId(brandId);
	}

	public List<EmallGood> findBySearchTag(String searchTag) {
		return goodDao.findBySearchTag(searchTag);
	}

	public List<EmallGood> findByShopCatId(String shopCatId) {
		return goodDao.findByShopCatId(shopCatId);
	}

	public EmallGood getGoodInfo(Long id) {
		return goodDao.findOne(id);
	}

	public void deleteById(Long id) {
		goodDao.delete(id);
	}

	public Page<EmallGood> getGoodsPage(Map<String, Object> searchParams,
			PageRequest pageRequest) {
		Specification<EmallGood> spec = buildSpecification(searchParams);
		return goodDao.findAll(spec, pageRequest);
	}

	@Transactional
	public EmallGood saveGood(EmallGood good) throws Exception {
		if (0 == good.getId()) {
			good.setId(goodDao.getNextId());
		}
		return goodDao.save(good);
	}

	/**
	 * 创建动态查询条件组合.
	 */
	private Specification<EmallGood> buildSpecification(
			Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<EmallGood> spec = DynamicSpecifications.bySearchFilter(
				filters.values(), EmallGood.class);
		return spec;
	}

}
