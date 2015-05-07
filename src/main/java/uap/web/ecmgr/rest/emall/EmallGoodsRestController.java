package uap.web.ecmgr.rest.emall;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springside.modules.web.MediaTypes;

import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.rest.RestException;
import uap.web.ecmgr.service.emall.EmallGoodsService;

@RestController
@RequestMapping(value = "/goods")
public class EmallGoodsRestController {
	private static Logger logger = LoggerFactory
			.getLogger(EmallGoodsRestController.class);

	@Autowired
	private EmallGoodsService goodsService;

	@Autowired
	private Validator validator;

	@RequestMapping(value = "/title", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByTitle(
			@RequestParam(value = "title", defaultValue = "1") String title) {
		List<EmallGood> goods = goodsService.findByTitle(title);
		if (goods.size() == 0) {
			String message = "商品不存在(title:" + title + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/catcode", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByCatCode(
			@RequestParam(value = "catCode", defaultValue = "1") String catCode) {
		List<EmallGood> goods = goodsService.findByCatCode(catCode);
		if (goods.size() == 0) {
			String message = "商品不存在(catCode:" + catCode + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/salenumber", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsBySaleNumber(
			@RequestParam(value = "saleNumber", defaultValue = "1") BigDecimal saleNumber) {
		List<EmallGood> goods = goodsService.findBySaleNumber(saleNumber);
		if (goods.size() == 0) {
			String message = "商品不存在(saleNumber:" + saleNumber + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/marketprice", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByMarketPrice(
			@RequestParam(value = "marketPrice", defaultValue = "1") BigDecimal marketPrice) {
		List<EmallGood> goods = goodsService.findBySaleNumber(marketPrice);
		if (goods.size() == 0) {
			String message = "商品不存在(marketPrice:" + marketPrice + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/goodsprice", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByGoodsPrice(
			@RequestParam(value = "goodsPrice", defaultValue = "1") BigDecimal goodsPrice) {
		List<EmallGood> goods = goodsService.findByGoodsPrice(goodsPrice);
		if (goods.size() == 0) {
			String message = "商品不存在(goodsPrice:" + goodsPrice + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/goodsnumber", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByGoodsNumber(
			@RequestParam(value = "goodsNumber", defaultValue = "1") BigDecimal goodsNumber) {
		List<EmallGood> goods = goodsService.findByGoodsNumber(goodsNumber);
		if (goods.size() == 0) {
			String message = "商品不存在(goodsNumber:" + goodsNumber + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/goodsstatus", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByGoodsStatus(
			@RequestParam(value = "goodsStatus", defaultValue = "1") String goodsStatus) {
		List<EmallGood> goods = goodsService.findByGoodsStatus(goodsStatus);
		if (goods.size() == 0) {
			String message = "商品不存在(goodsStatus:" + goodsStatus + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/goodsrank", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByGoodsRank(
			@RequestParam(value = "goodsRank", defaultValue = "1") BigDecimal goodsRank) {
		List<EmallGood> goods = goodsService.findByGoodsRank(goodsRank);
		if (goods.size() == 0) {
			String message = "商品不存在(goodsRank:" + goodsRank + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/brandid", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByBrandId(
			@RequestParam(value = "brandId", defaultValue = "1") BigDecimal brandId) {
		List<EmallGood> goods = goodsService.findByBrandId(brandId);
		if (goods.size() == 0) {
			String message = "商品不存在(brandId:" + brandId + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/searchtag", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsBySearchTag(
			@RequestParam(value = "searchTag", defaultValue = "1") String searchTag) {
		List<EmallGood> goods = goodsService.findBySearchTag(searchTag);
		if (goods.size() == 0) {
			String message = "商品不存在(searchTag:" + searchTag + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(value = "/shopcatid", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listGoodsByShopCatId(
			@RequestParam(value = "shopCatId", defaultValue = "1") String shopCatId) {
		List<EmallGood> goods = goodsService.findByShopCatId(shopCatId);
		if (goods.size() == 0) {
			String message = "商品不存在(shopCatId:" + shopCatId + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return goods;
	}

	@RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallGood> listRootCates() {
		return goodsService.findByTitle("田园");
	}

}
