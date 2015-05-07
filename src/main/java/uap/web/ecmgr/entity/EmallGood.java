package uap.web.ecmgr.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import uap.web.cache.annotation.Clearable;

/**
 * The persistent class for the emall_goods database table.
 * 
 */
@Entity
@Table(name = "emall_goods")
@Clearable(url="/goods/",attrbute="id")
@NamedQuery(name = "EmallGood.findAll", query = "SELECT e FROM EmallGood e")
public class EmallGood implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	// @GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	@Column(name = "attr_desc")
	private String attrDesc;

	@Column(name = "attr_value")
	private String attrValue;

	@Column(name = "audit_remark")
	private String auditRemark;

	@Column(name = "auth_flag")
	private BigDecimal authFlag;

	@Column(name = "bid_deduction")
	private BigDecimal bidDeduction;

	@Column(name = "bidder_margin_freezed")
	private BigDecimal bidderMarginFreezed;

	@Column(name = "brand_id")
	private BigDecimal brandId;

	@Column(name = "cat_code")
	private String catCode;

	@Column(name = "city_abbname")
	private String cityAbbname;

	@Column(name = "city_code")
	private String cityCode;

	@Column(name = "click_count")
	private BigDecimal clickCount;

	private BigDecimal commission;

	@Column(name = "cost_amount")
	private BigDecimal costAmount;

	@Column(name = "ems_amount")
	private BigDecimal emsAmount;

	@Column(name = "ems_cod_amount")
	private BigDecimal emsCodAmount;

	@Column(name = "express_amount")
	private BigDecimal expressAmount;

	@Column(name = "express_cod_amount")
	private BigDecimal expressCodAmount;

	@Column(name = "first_audit")
	private String firstAudit;

	@Column(name = "fixed_attr")
	private String fixedAttr;

	@Column(name = "gmt_audit")
	private Timestamp gmtAudit;

	@Column(name = "gmt_create")
	private Timestamp gmtCreate;

	@Column(name = "gmt_cutprice")
	private Timestamp gmtCutprice;

	@Column(name = "gmt_delisting")
	private Timestamp gmtDelisting;

	@Column(name = "gmt_listing")
	private Timestamp gmtListing;

	@Column(name = "gmt_modify")
	private Timestamp gmtModify;

	@Lob
	@Column(name = "goods_desc")
	private String goodsDesc;

	@Column(name = "goods_district")
	private String goodsDistrict;

	@Column(name = "goods_model")
	private String goodsModel;

	@Column(name = "goods_number")
	private BigDecimal goodsNumber;

	@Column(name = "goods_price")
	private BigDecimal goodsPrice;

	@Column(name = "goods_rank")
	private BigDecimal goodsRank;

	@Lob
	@Column(name = "goods_selling_point")
	private String goodsSellingPoint;

	@Column(name = "goods_sn")
	private String goodsSn;

	@Column(name = "goods_status")
	private String goodsStatus;

	@Column(name = "goods_type")
	private String goodsType;

	@Column(name = "goods_video")
	private String goodsVideo;

	@Column(name = "goods_weight")
	private BigDecimal goodsWeight;

	@Column(name = "gout_type")
	private String goutType;

	@Column(name = "high_original_price")
	private BigDecimal highOriginalPrice;

	@Column(name = "high_price")
	private BigDecimal highPrice;

	@Column(name = "img_large")
	private String imgLarge;

	@Column(name = "img_middle")
	private String imgMiddle;

	@Column(name = "img_small")
	private String imgSmall;

	@Column(name = "increase_rate")
	private BigDecimal increaseRate;

	@Column(name = "is_bundling")
	private String isBundling;

	@Column(name = "is_cutprice")
	private String isCutprice;

	@Column(name = "is_fragile")
	private BigDecimal isFragile;

	@Column(name = "is_freeze")
	private String isFreeze;

	@Column(name = "is_listing_now")
	private String isListingNow;

	@Column(name = "logistics_type")
	private BigDecimal logisticsType;

	@Column(name = "low_original_price")
	private BigDecimal lowOriginalPrice;

	@Column(name = "low_price")
	private BigDecimal lowPrice;

	@Column(name = "mailing_amount")
	private BigDecimal mailingAmount;

	@Column(name = "mailing_cod_amount")
	private BigDecimal mailingCodAmount;

	@Column(name = "market_price")
	private BigDecimal marketPrice;

	@Column(name = "max_delivery_cycle")
	private BigDecimal maxDeliveryCycle;

	@Column(name = "min_delivery_cycle")
	private BigDecimal minDeliveryCycle;

	private BigDecimal options;

	@Column(name = "original_img")
	private String originalImg;

	@Column(name = "postage_id")
	private BigDecimal postageId;

	@Column(name = "prepay_amount")
	private BigDecimal prepayAmount;

	@Column(name = "promotions_e_time")
	private Timestamp promotionsETime;

	@Column(name = "promotions_price")
	private BigDecimal promotionsPrice;

	@Column(name = "promotions_s_time")
	private Timestamp promotionsSTime;

	@Column(name = "province_abbname")
	private String provinceAbbname;

	@Column(name = "province_code")
	private String provinceCode;

	@Column(name = "qr_code_url")
	private String qrCodeUrl;

	@Column(name = "reserve_price")
	private BigDecimal reservePrice;

	@Column(name = "sale_num_begin")
	private BigDecimal saleNumBegin;

	@Column(name = "sale_number")
	private BigDecimal saleNumber;

	@Column(name = "search_tag")
	private String searchTag;

	@Column(name = "second_audit")
	private String secondAudit;

	@Column(name = "seller_id")
	private BigDecimal sellerId;

	@Column(name = "seller_margin")
	private BigDecimal sellerMargin;

	@Column(name = "seller_nick")
	private String sellerNick;

	@Column(name = "send_flag")
	private BigDecimal sendFlag;

	@Column(name = "shop_cat_code")
	private String shopCatCode;

	@Column(name = "shop_cat_id")
	private String shopCatId;

	@Column(name = "shop_id")
	private BigDecimal shopId;

	private String title;

	@Column(name = "version_num")
	private BigDecimal versionNum;

	@Column(name = "warn_number")
	private BigDecimal warnNumber;

	@Column(name = "weighted_value")
	private BigDecimal weightedValue;

	/*
	 * //属性OneToMany
	 * 
	 * @OneToMany(mappedBy="good") private List<EmallGoodsAttr> attr;
	 * 
	 * public List<EmallGoodsAttr> getAttr() { return attr; }
	 * 
	 * public void setGoodsAttr(List<EmallGoodsAttr> attr){ this.attr=attr; }
	 * ///end
	 */
	public EmallGood() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAttrDesc() {
		return this.attrDesc;
	}

	public void setAttrDesc(String attrDesc) {
		this.attrDesc = attrDesc;
	}

	public String getAttrValue() {
		return this.attrValue;
	}

	public void setAttrValue(String attrValue) {
		this.attrValue = attrValue;
	}

	public String getAuditRemark() {
		return this.auditRemark;
	}

	public void setAuditRemark(String auditRemark) {
		this.auditRemark = auditRemark;
	}

	public BigDecimal getAuthFlag() {
		return this.authFlag;
	}

	public void setAuthFlag(BigDecimal authFlag) {
		this.authFlag = authFlag;
	}

	public BigDecimal getBidDeduction() {
		return this.bidDeduction;
	}

	public void setBidDeduction(BigDecimal bidDeduction) {
		this.bidDeduction = bidDeduction;
	}

	public BigDecimal getBidderMarginFreezed() {
		return this.bidderMarginFreezed;
	}

	public void setBidderMarginFreezed(BigDecimal bidderMarginFreezed) {
		this.bidderMarginFreezed = bidderMarginFreezed;
	}

	public BigDecimal getBrandId() {
		return this.brandId;
	}

	public void setBrandId(BigDecimal brandId) {
		this.brandId = brandId;
	}

	public String getCatCode() {
		return this.catCode;
	}

	public void setCatCode(String catCode) {
		this.catCode = catCode;
	}

	public String getCityAbbname() {
		return this.cityAbbname;
	}

	public void setCityAbbname(String cityAbbname) {
		this.cityAbbname = cityAbbname;
	}

	public String getCityCode() {
		return this.cityCode;
	}

	public void setCityCode(String cityCode) {
		this.cityCode = cityCode;
	}

	public BigDecimal getClickCount() {
		return this.clickCount;
	}

	public void setClickCount(BigDecimal clickCount) {
		this.clickCount = clickCount;
	}

	public BigDecimal getCommission() {
		return this.commission;
	}

	public void setCommission(BigDecimal commission) {
		this.commission = commission;
	}

	public BigDecimal getCostAmount() {
		return this.costAmount;
	}

	public void setCostAmount(BigDecimal costAmount) {
		this.costAmount = costAmount;
	}

	public BigDecimal getEmsAmount() {
		return this.emsAmount;
	}

	public void setEmsAmount(BigDecimal emsAmount) {
		this.emsAmount = emsAmount;
	}

	public BigDecimal getEmsCodAmount() {
		return this.emsCodAmount;
	}

	public void setEmsCodAmount(BigDecimal emsCodAmount) {
		this.emsCodAmount = emsCodAmount;
	}

	public BigDecimal getExpressAmount() {
		return this.expressAmount;
	}

	public void setExpressAmount(BigDecimal expressAmount) {
		this.expressAmount = expressAmount;
	}

	public BigDecimal getExpressCodAmount() {
		return this.expressCodAmount;
	}

	public void setExpressCodAmount(BigDecimal expressCodAmount) {
		this.expressCodAmount = expressCodAmount;
	}

	public String getFirstAudit() {
		return this.firstAudit;
	}

	public void setFirstAudit(String firstAudit) {
		this.firstAudit = firstAudit;
	}

	public String getFixedAttr() {
		return this.fixedAttr;
	}

	public void setFixedAttr(String fixedAttr) {
		this.fixedAttr = fixedAttr;
	}

	public Timestamp getGmtAudit() {
		return this.gmtAudit;
	}

	public void setGmtAudit(Timestamp gmtAudit) {
		this.gmtAudit = gmtAudit;
	}

	public Timestamp getGmtCreate() {
		return this.gmtCreate;
	}

	public void setGmtCreate(Timestamp gmtCreate) {
		this.gmtCreate = gmtCreate;
	}

	public Timestamp getGmtCutprice() {
		return this.gmtCutprice;
	}

	public void setGmtCutprice(Timestamp gmtCutprice) {
		this.gmtCutprice = gmtCutprice;
	}

	public Timestamp getGmtDelisting() {
		return this.gmtDelisting;
	}

	public void setGmtDelisting(Timestamp gmtDelisting) {
		this.gmtDelisting = gmtDelisting;
	}

	public Timestamp getGmtListing() {
		return this.gmtListing;
	}

	public void setGmtListing(Timestamp gmtListing) {
		this.gmtListing = gmtListing;
	}

	public Timestamp getGmtModify() {
		return this.gmtModify;
	}

	public void setGmtModify(Timestamp gmtModify) {
		this.gmtModify = gmtModify;
	}

	public String getGoodsDesc() {
		return this.goodsDesc;
	}

	public void setGoodsDesc(String goodsDesc) {
		this.goodsDesc = goodsDesc;
	}

	public String getGoodsDistrict() {
		return this.goodsDistrict;
	}

	public void setGoodsDistrict(String goodsDistrict) {
		this.goodsDistrict = goodsDistrict;
	}

	public String getGoodsModel() {
		return this.goodsModel;
	}

	public void setGoodsModel(String goodsModel) {
		this.goodsModel = goodsModel;
	}

	public BigDecimal getGoodsNumber() {
		return this.goodsNumber;
	}

	public void setGoodsNumber(BigDecimal goodsNumber) {
		this.goodsNumber = goodsNumber;
	}

	public BigDecimal getGoodsPrice() {
		return this.goodsPrice;
	}

	public void setGoodsPrice(BigDecimal goodsPrice) {
		this.goodsPrice = goodsPrice;
	}

	public BigDecimal getGoodsRank() {
		return this.goodsRank;
	}

	public void setGoodsRank(BigDecimal goodsRank) {
		this.goodsRank = goodsRank;
	}

	public String getGoodsSellingPoint() {
		return this.goodsSellingPoint;
	}

	public void setGoodsSellingPoint(String goodsSellingPoint) {
		this.goodsSellingPoint = goodsSellingPoint;
	}

	public String getGoodsSn() {
		return this.goodsSn;
	}

	public void setGoodsSn(String goodsSn) {
		this.goodsSn = goodsSn;
	}

	public String getGoodsStatus() {
		return this.goodsStatus;
	}

	public void setGoodsStatus(String goodsStatus) {
		this.goodsStatus = goodsStatus;
	}

	public String getGoodsType() {
		return this.goodsType;
	}

	public void setGoodsType(String goodsType) {
		this.goodsType = goodsType;
	}

	public String getGoodsVideo() {
		return this.goodsVideo;
	}

	public void setGoodsVideo(String goodsVideo) {
		this.goodsVideo = goodsVideo;
	}

	public BigDecimal getGoodsWeight() {
		return this.goodsWeight;
	}

	public void setGoodsWeight(BigDecimal goodsWeight) {
		this.goodsWeight = goodsWeight;
	}

	public String getGoutType() {
		return this.goutType;
	}

	public void setGoutType(String goutType) {
		this.goutType = goutType;
	}

	public BigDecimal getHighOriginalPrice() {
		return this.highOriginalPrice;
	}

	public void setHighOriginalPrice(BigDecimal highOriginalPrice) {
		this.highOriginalPrice = highOriginalPrice;
	}

	public BigDecimal getHighPrice() {
		return this.highPrice;
	}

	public void setHighPrice(BigDecimal highPrice) {
		this.highPrice = highPrice;
	}

	public String getImgLarge() {
		return this.imgLarge;
	}

	public void setImgLarge(String imgLarge) {
		this.imgLarge = imgLarge;
	}

	public String getImgMiddle() {
		return this.imgMiddle;
	}

	public void setImgMiddle(String imgMiddle) {
		this.imgMiddle = imgMiddle;
	}

	public String getImgSmall() {
		return this.imgSmall;
	}

	public void setImgSmall(String imgSmall) {
		this.imgSmall = imgSmall;
	}

	public BigDecimal getIncreaseRate() {
		return this.increaseRate;
	}

	public void setIncreaseRate(BigDecimal increaseRate) {
		this.increaseRate = increaseRate;
	}

	public String getIsBundling() {
		return this.isBundling;
	}

	public void setIsBundling(String isBundling) {
		this.isBundling = isBundling;
	}

	public String getIsCutprice() {
		return this.isCutprice;
	}

	public void setIsCutprice(String isCutprice) {
		this.isCutprice = isCutprice;
	}

	public BigDecimal getIsFragile() {
		return this.isFragile;
	}

	public void setIsFragile(BigDecimal isFragile) {
		this.isFragile = isFragile;
	}

	public String getIsFreeze() {
		return this.isFreeze;
	}

	public void setIsFreeze(String isFreeze) {
		this.isFreeze = isFreeze;
	}

	public String getIsListingNow() {
		return this.isListingNow;
	}

	public void setIsListingNow(String isListingNow) {
		this.isListingNow = isListingNow;
	}

	public BigDecimal getLogisticsType() {
		return this.logisticsType;
	}

	public void setLogisticsType(BigDecimal logisticsType) {
		this.logisticsType = logisticsType;
	}

	public BigDecimal getLowOriginalPrice() {
		return this.lowOriginalPrice;
	}

	public void setLowOriginalPrice(BigDecimal lowOriginalPrice) {
		this.lowOriginalPrice = lowOriginalPrice;
	}

	public BigDecimal getLowPrice() {
		return this.lowPrice;
	}

	public void setLowPrice(BigDecimal lowPrice) {
		this.lowPrice = lowPrice;
	}

	public BigDecimal getMailingAmount() {
		return this.mailingAmount;
	}

	public void setMailingAmount(BigDecimal mailingAmount) {
		this.mailingAmount = mailingAmount;
	}

	public BigDecimal getMailingCodAmount() {
		return this.mailingCodAmount;
	}

	public void setMailingCodAmount(BigDecimal mailingCodAmount) {
		this.mailingCodAmount = mailingCodAmount;
	}

	public BigDecimal getMarketPrice() {
		return this.marketPrice;
	}

	public void setMarketPrice(BigDecimal marketPrice) {
		this.marketPrice = marketPrice;
	}

	public BigDecimal getMaxDeliveryCycle() {
		return this.maxDeliveryCycle;
	}

	public void setMaxDeliveryCycle(BigDecimal maxDeliveryCycle) {
		this.maxDeliveryCycle = maxDeliveryCycle;
	}

	public BigDecimal getMinDeliveryCycle() {
		return this.minDeliveryCycle;
	}

	public void setMinDeliveryCycle(BigDecimal minDeliveryCycle) {
		this.minDeliveryCycle = minDeliveryCycle;
	}

	public BigDecimal getOptions() {
		return this.options;
	}

	public void setOptions(BigDecimal options) {
		this.options = options;
	}

	public String getOriginalImg() {
		return this.originalImg;
	}

	public void setOriginalImg(String originalImg) {
		this.originalImg = originalImg;
	}

	public BigDecimal getPostageId() {
		return this.postageId;
	}

	public void setPostageId(BigDecimal postageId) {
		this.postageId = postageId;
	}

	public BigDecimal getPrepayAmount() {
		return this.prepayAmount;
	}

	public void setPrepayAmount(BigDecimal prepayAmount) {
		this.prepayAmount = prepayAmount;
	}

	public Timestamp getPromotionsETime() {
		return this.promotionsETime;
	}

	public void setPromotionsETime(Timestamp promotionsETime) {
		this.promotionsETime = promotionsETime;
	}

	public BigDecimal getPromotionsPrice() {
		return this.promotionsPrice;
	}

	public void setPromotionsPrice(BigDecimal promotionsPrice) {
		this.promotionsPrice = promotionsPrice;
	}

	public Timestamp getPromotionsSTime() {
		return this.promotionsSTime;
	}

	public void setPromotionsSTime(Timestamp promotionsSTime) {
		this.promotionsSTime = promotionsSTime;
	}

	public String getProvinceAbbname() {
		return this.provinceAbbname;
	}

	public void setProvinceAbbname(String provinceAbbname) {
		this.provinceAbbname = provinceAbbname;
	}

	public String getProvinceCode() {
		return this.provinceCode;
	}

	public void setProvinceCode(String provinceCode) {
		this.provinceCode = provinceCode;
	}

	public String getQrCodeUrl() {
		return this.qrCodeUrl;
	}

	public void setQrCodeUrl(String qrCodeUrl) {
		this.qrCodeUrl = qrCodeUrl;
	}

	public BigDecimal getReservePrice() {
		return this.reservePrice;
	}

	public void setReservePrice(BigDecimal reservePrice) {
		this.reservePrice = reservePrice;
	}

	public BigDecimal getSaleNumBegin() {
		return this.saleNumBegin;
	}

	public void setSaleNumBegin(BigDecimal saleNumBegin) {
		this.saleNumBegin = saleNumBegin;
	}

	public BigDecimal getSaleNumber() {
		return this.saleNumber;
	}

	public void setSaleNumber(BigDecimal saleNumber) {
		this.saleNumber = saleNumber;
	}

	public String getSearchTag() {
		return this.searchTag;
	}

	public void setSearchTag(String searchTag) {
		this.searchTag = searchTag;
	}

	public String getSecondAudit() {
		return this.secondAudit;
	}

	public void setSecondAudit(String secondAudit) {
		this.secondAudit = secondAudit;
	}

	public BigDecimal getSellerId() {
		return this.sellerId;
	}

	public void setSellerId(BigDecimal sellerId) {
		this.sellerId = sellerId;
	}

	public BigDecimal getSellerMargin() {
		return this.sellerMargin;
	}

	public void setSellerMargin(BigDecimal sellerMargin) {
		this.sellerMargin = sellerMargin;
	}

	public String getSellerNick() {
		return this.sellerNick;
	}

	public void setSellerNick(String sellerNick) {
		this.sellerNick = sellerNick;
	}

	public BigDecimal getSendFlag() {
		return this.sendFlag;
	}

	public void setSendFlag(BigDecimal sendFlag) {
		this.sendFlag = sendFlag;
	}

	public String getShopCatCode() {
		return this.shopCatCode;
	}

	public void setShopCatCode(String shopCatCode) {
		this.shopCatCode = shopCatCode;
	}

	public String getShopCatId() {
		return this.shopCatId;
	}

	public void setShopCatId(String shopCatId) {
		this.shopCatId = shopCatId;
	}

	public BigDecimal getShopId() {
		return this.shopId;
	}

	public void setShopId(BigDecimal shopId) {
		this.shopId = shopId;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public BigDecimal getVersionNum() {
		return this.versionNum;
	}

	public void setVersionNum(BigDecimal versionNum) {
		this.versionNum = versionNum;
	}

	public BigDecimal getWarnNumber() {
		return this.warnNumber;
	}

	public void setWarnNumber(BigDecimal warnNumber) {
		this.warnNumber = warnNumber;
	}

	public BigDecimal getWeightedValue() {
		return this.weightedValue;
	}

	public void setWeightedValue(BigDecimal weightedValue) {
		this.weightedValue = weightedValue;
	}

}