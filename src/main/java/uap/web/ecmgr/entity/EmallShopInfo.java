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
import javax.xml.bind.annotation.XmlRootElement;


/**
 * yandyd
 * 
 */
@XmlRootElement
@Entity
@Table(name="emall_shop_info") 
@NamedQuery(name="EmallShopInfo.findAll", query="SELECT e FROM EmallShopInfo e")
public class EmallShopInfo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column(name="address_city")
	private String addressCity;

	@Column(name="address_id")
	private BigDecimal addressId;

	@Column(name="address_province")
	private String addressProvince;

	@Column(name="agencies_code")
	private String agenciesCode;

	@Column(name="agencies_imp")
	private String agenciesImp;

	@Column(name="back_goods_7day")
	private BigDecimal backGoods7day;

	@Column(name="brand_names")
	private String brandNames;

	@Column(name="bus_products")
	private String busProducts;

	@Column(name="business_license")
	private String businessLicense;

	@Column(name="business_license_deadline")
	private Timestamp businessLicenseDeadline;

	@Column(name="business_license_img")
	private String businessLicenseImg;

	@Column(name="business_region")
	private String businessRegion;

	@Column(name="category_id")
	private String categoryId;

	@Column(name="cert_flag")
	private BigDecimal certFlag;

	private BigDecimal commission;

	@Column(name="company_addr")
	private String companyAddr;

	@Column(name="company_name")
	private String companyName;

	private String contancts;

	@Column(name="countryhouse_id")
	private BigDecimal countryhouseId;

	private String creater;

	@Column(name="cus_declare_days")
	private BigDecimal cusDeclareDays;

	@Column(name="customer_code")
	private String customerCode;

	private String dept;

	@Column(name="dept_sub")
	private String deptSub;

	private String email;

	@Column(name="entity_shop_address")
	private String entityShopAddress;

	@Column(name="entity_shop_name")
	private String entityShopName;

	@Column(name="favicon_logo")
	private String faviconLogo;

	@Column(name="favorite_count")
	private BigDecimal favoriteCount;

	@Column(name="gmt_create")
	private String gmtCreate;

	@Column(name="gmt_modify")
	private Timestamp gmtModify;

	@Column(name="goods_count")
	private BigDecimal goodsCount;

	@Column(name="goods_no_auditing")
	private BigDecimal goodsNoAuditing;

	@Column(name="index_shop_logo")
	private String indexShopLogo;

	@Column(name="is_auction")
	private BigDecimal isAuction;

	@Column(name="is_customer")
	private String isCustomer;

	@Column(name="is_deleted")
	private String isDeleted;

	@Column(name="is_diy")
	private BigDecimal isDiy;

	@Column(name="is_entity")
	private BigDecimal isEntity;

	@Column(name="is_invoice")
	private BigDecimal isInvoice;

	@Column(name="is_recommend")
	private BigDecimal isRecommend;

	@Column(name="is_webchat")
	private String isWebchat;

	@Column(name="legal_prson")
	private String legalPrson;

	@Column(name="lp_card_img")
	private String lpCardImg;

	@Column(name="lp_card_no")
	private String lpCardNo;

	@Column(name="lp_card_type")
	private String lpCardType;

	@Column(name="max_img_space")
	private BigDecimal maxImgSpace;

	private String minisite;

	private String mobile;

	private String modifier;

	private String msn;

	@Column(name="page_dis_type")
	private String pageDisType;

	private String phone;

	private BigDecimal priority;

	@Lob
	@Column(name="promation_desc")
	private String promationDesc;

	@Column(name="promation_show_status")
	private BigDecimal promationShowStatus;

	@Column(name="proxy_dead_line")
	private Timestamp proxyDeadLine;

	@Column(name="proxy_file")
	private String proxyFile;

	private String qq;

	@Column(name="qr_code_url")
	private String qrCodeUrl;

	@Column(name="rec_pay")
	private String recPay;

	@Column(name="receive_account")
	private String receiveAccount;

	@Column(name="recom_modify")
	private Timestamp recomModify;

	@Column(name="registered_capital")
	private BigDecimal registeredCapital;

	@Column(name="sale_num")
	private BigDecimal saleNum;

	@Column(name="sales_point")
	private BigDecimal salesPoint;

	@Column(name="security_alert")
	private BigDecimal securityAlert;

	@Column(name="security_amount")
	private BigDecimal securityAmount;

	@Column(name="service_tel")
	private String serviceTel;

	@Lob
	@Column(name="shop_bulletin")
	private String shopBulletin;

	@Lob
	@Column(name="shop_desc")
	private String shopDesc;

	@Column(name="shop_logo")
	private String shopLogo;

	@Column(name="shop_name")
	private String shopName;

	@Lob
	@Column(name="shop_show")
	private String shopShow;

	@Column(name="shop_standard_logo")
	private String shopStandardLogo;

	@Column(name="shop_style")
	private BigDecimal shopStyle;

	@Column(name="shop_title")
	private String shopTitle;

	@Column(name="shop_type")
	private String shopType;

	private String status;

	@Column(name="tax_register_number")
	private String taxRegisterNumber;

	@Column(name="un_need_sku")
	private String unNeedSku;

	@Column(name="used_img_space")
	private BigDecimal usedImgSpace;

	@Column(name="user_id")
	private BigDecimal userId;

	@Column(name="video_img")
	private String videoImg;

	@Column(name="video_url")
	private String videoUrl;

	@Column(name="vip_discount")
	private BigDecimal vipDiscount;

	@Column(name="withdrawal_account")
	private String withdrawalAccount;

	@Column(name="withdrawal_bank")
	private String withdrawalBank;

	@Column(name="withdrawal_city")
	private String withdrawalCity;

	@Column(name="withdrawal_desc")
	private String withdrawalDesc;

	@Column(name="withdrawal_name")
	private String withdrawalName;

	@Column(name="withdrawal_province")
	private String withdrawalProvince;

	private String ww;

	private String ym;

	public EmallShopInfo() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAddressCity() {
		return this.addressCity;
	}

	public void setAddressCity(String addressCity) {
		this.addressCity = addressCity;
	}

	public BigDecimal getAddressId() {
		return this.addressId;
	}

	public void setAddressId(BigDecimal addressId) {
		this.addressId = addressId;
	}

	public String getAddressProvince() {
		return this.addressProvince;
	}

	public void setAddressProvince(String addressProvince) {
		this.addressProvince = addressProvince;
	}

	public String getAgenciesCode() {
		return this.agenciesCode;
	}

	public void setAgenciesCode(String agenciesCode) {
		this.agenciesCode = agenciesCode;
	}

	public String getAgenciesImp() {
		return this.agenciesImp;
	}

	public void setAgenciesImp(String agenciesImp) {
		this.agenciesImp = agenciesImp;
	}

	public BigDecimal getBackGoods7day() {
		return this.backGoods7day;
	}

	public void setBackGoods7day(BigDecimal backGoods7day) {
		this.backGoods7day = backGoods7day;
	}

	public String getBrandNames() {
		return this.brandNames;
	}

	public void setBrandNames(String brandNames) {
		this.brandNames = brandNames;
	}

	public String getBusProducts() {
		return this.busProducts;
	}

	public void setBusProducts(String busProducts) {
		this.busProducts = busProducts;
	}

	public String getBusinessLicense() {
		return this.businessLicense;
	}

	public void setBusinessLicense(String businessLicense) {
		this.businessLicense = businessLicense;
	}

	public Timestamp getBusinessLicenseDeadline() {
		return this.businessLicenseDeadline;
	}

	public void setBusinessLicenseDeadline(Timestamp businessLicenseDeadline) {
		this.businessLicenseDeadline = businessLicenseDeadline;
	}

	public String getBusinessLicenseImg() {
		return this.businessLicenseImg;
	}

	public void setBusinessLicenseImg(String businessLicenseImg) {
		this.businessLicenseImg = businessLicenseImg;
	}

	public String getBusinessRegion() {
		return this.businessRegion;
	}

	public void setBusinessRegion(String businessRegion) {
		this.businessRegion = businessRegion;
	}

	public String getCategoryId() {
		return this.categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public BigDecimal getCertFlag() {
		return this.certFlag;
	}

	public void setCertFlag(BigDecimal certFlag) {
		this.certFlag = certFlag;
	}

	public BigDecimal getCommission() {
		return this.commission;
	}

	public void setCommission(BigDecimal commission) {
		this.commission = commission;
	}

	public String getCompanyAddr() {
		return this.companyAddr;
	}

	public void setCompanyAddr(String companyAddr) {
		this.companyAddr = companyAddr;
	}

	public String getCompanyName() {
		return this.companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getContancts() {
		return this.contancts;
	}

	public void setContancts(String contancts) {
		this.contancts = contancts;
	}

	public BigDecimal getCountryhouseId() {
		return this.countryhouseId;
	}

	public void setCountryhouseId(BigDecimal countryhouseId) {
		this.countryhouseId = countryhouseId;
	}

	public String getCreater() {
		return this.creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	public BigDecimal getCusDeclareDays() {
		return this.cusDeclareDays;
	}

	public void setCusDeclareDays(BigDecimal cusDeclareDays) {
		this.cusDeclareDays = cusDeclareDays;
	}

	public String getCustomerCode() {
		return this.customerCode;
	}

	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}

	public String getDept() {
		return this.dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public String getDeptSub() {
		return this.deptSub;
	}

	public void setDeptSub(String deptSub) {
		this.deptSub = deptSub;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEntityShopAddress() {
		return this.entityShopAddress;
	}

	public void setEntityShopAddress(String entityShopAddress) {
		this.entityShopAddress = entityShopAddress;
	}

	public String getEntityShopName() {
		return this.entityShopName;
	}

	public void setEntityShopName(String entityShopName) {
		this.entityShopName = entityShopName;
	}

	public String getFaviconLogo() {
		return this.faviconLogo;
	}

	public void setFaviconLogo(String faviconLogo) {
		this.faviconLogo = faviconLogo;
	}

	public BigDecimal getFavoriteCount() {
		return this.favoriteCount;
	}

	public void setFavoriteCount(BigDecimal favoriteCount) {
		this.favoriteCount = favoriteCount;
	}

	public String getGmtCreate() {
		return this.gmtCreate;
	}

	public void setGmtCreate(String gmtCreate) {
		this.gmtCreate = gmtCreate;
	}

	public Timestamp getGmtModify() {
		return this.gmtModify;
	}

	public void setGmtModify(Timestamp gmtModify) {
		this.gmtModify = gmtModify;
	}

	public BigDecimal getGoodsCount() {
		return this.goodsCount;
	}

	public void setGoodsCount(BigDecimal goodsCount) {
		this.goodsCount = goodsCount;
	}

	public BigDecimal getGoodsNoAuditing() {
		return this.goodsNoAuditing;
	}

	public void setGoodsNoAuditing(BigDecimal goodsNoAuditing) {
		this.goodsNoAuditing = goodsNoAuditing;
	}

	public String getIndexShopLogo() {
		return this.indexShopLogo;
	}

	public void setIndexShopLogo(String indexShopLogo) {
		this.indexShopLogo = indexShopLogo;
	}

	public BigDecimal getIsAuction() {
		return this.isAuction;
	}

	public void setIsAuction(BigDecimal isAuction) {
		this.isAuction = isAuction;
	}

	public String getIsCustomer() {
		return this.isCustomer;
	}

	public void setIsCustomer(String isCustomer) {
		this.isCustomer = isCustomer;
	}

	public String getIsDeleted() {
		return this.isDeleted;
	}

	public void setIsDeleted(String isDeleted) {
		this.isDeleted = isDeleted;
	}

	public BigDecimal getIsDiy() {
		return this.isDiy;
	}

	public void setIsDiy(BigDecimal isDiy) {
		this.isDiy = isDiy;
	}

	public BigDecimal getIsEntity() {
		return this.isEntity;
	}

	public void setIsEntity(BigDecimal isEntity) {
		this.isEntity = isEntity;
	}

	public BigDecimal getIsInvoice() {
		return this.isInvoice;
	}

	public void setIsInvoice(BigDecimal isInvoice) {
		this.isInvoice = isInvoice;
	}

	public BigDecimal getIsRecommend() {
		return this.isRecommend;
	}

	public void setIsRecommend(BigDecimal isRecommend) {
		this.isRecommend = isRecommend;
	}

	public String getIsWebchat() {
		return this.isWebchat;
	}

	public void setIsWebchat(String isWebchat) {
		this.isWebchat = isWebchat;
	}

	public String getLegalPrson() {
		return this.legalPrson;
	}

	public void setLegalPrson(String legalPrson) {
		this.legalPrson = legalPrson;
	}

	public String getLpCardImg() {
		return this.lpCardImg;
	}

	public void setLpCardImg(String lpCardImg) {
		this.lpCardImg = lpCardImg;
	}

	public String getLpCardNo() {
		return this.lpCardNo;
	}

	public void setLpCardNo(String lpCardNo) {
		this.lpCardNo = lpCardNo;
	}

	public String getLpCardType() {
		return this.lpCardType;
	}

	public void setLpCardType(String lpCardType) {
		this.lpCardType = lpCardType;
	}

	public BigDecimal getMaxImgSpace() {
		return this.maxImgSpace;
	}

	public void setMaxImgSpace(BigDecimal maxImgSpace) {
		this.maxImgSpace = maxImgSpace;
	}

	public String getMinisite() {
		return this.minisite;
	}

	public void setMinisite(String minisite) {
		this.minisite = minisite;
	}

	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getModifier() {
		return this.modifier;
	}

	public void setModifier(String modifier) {
		this.modifier = modifier;
	}

	public String getMsn() {
		return this.msn;
	}

	public void setMsn(String msn) {
		this.msn = msn;
	}

	public String getPageDisType() {
		return this.pageDisType;
	}

	public void setPageDisType(String pageDisType) {
		this.pageDisType = pageDisType;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public BigDecimal getPriority() {
		return this.priority;
	}

	public void setPriority(BigDecimal priority) {
		this.priority = priority;
	}

	public String getPromationDesc() {
		return this.promationDesc;
	}

	public void setPromationDesc(String promationDesc) {
		this.promationDesc = promationDesc;
	}

	public BigDecimal getPromationShowStatus() {
		return this.promationShowStatus;
	}

	public void setPromationShowStatus(BigDecimal promationShowStatus) {
		this.promationShowStatus = promationShowStatus;
	}

	public Timestamp getProxyDeadLine() {
		return this.proxyDeadLine;
	}

	public void setProxyDeadLine(Timestamp proxyDeadLine) {
		this.proxyDeadLine = proxyDeadLine;
	}

	public String getProxyFile() {
		return this.proxyFile;
	}

	public void setProxyFile(String proxyFile) {
		this.proxyFile = proxyFile;
	}

	public String getQq() {
		return this.qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getQrCodeUrl() {
		return this.qrCodeUrl;
	}

	public void setQrCodeUrl(String qrCodeUrl) {
		this.qrCodeUrl = qrCodeUrl;
	}

	public String getRecPay() {
		return this.recPay;
	}

	public void setRecPay(String recPay) {
		this.recPay = recPay;
	}

	public String getReceiveAccount() {
		return this.receiveAccount;
	}

	public void setReceiveAccount(String receiveAccount) {
		this.receiveAccount = receiveAccount;
	}

	public Timestamp getRecomModify() {
		return this.recomModify;
	}

	public void setRecomModify(Timestamp recomModify) {
		this.recomModify = recomModify;
	}

	public BigDecimal getRegisteredCapital() {
		return this.registeredCapital;
	}

	public void setRegisteredCapital(BigDecimal registeredCapital) {
		this.registeredCapital = registeredCapital;
	}

	public BigDecimal getSaleNum() {
		return this.saleNum;
	}

	public void setSaleNum(BigDecimal saleNum) {
		this.saleNum = saleNum;
	}

	public BigDecimal getSalesPoint() {
		return this.salesPoint;
	}

	public void setSalesPoint(BigDecimal salesPoint) {
		this.salesPoint = salesPoint;
	}

	public BigDecimal getSecurityAlert() {
		return this.securityAlert;
	}

	public void setSecurityAlert(BigDecimal securityAlert) {
		this.securityAlert = securityAlert;
	}

	public BigDecimal getSecurityAmount() {
		return this.securityAmount;
	}

	public void setSecurityAmount(BigDecimal securityAmount) {
		this.securityAmount = securityAmount;
	}

	public String getServiceTel() {
		return this.serviceTel;
	}

	public void setServiceTel(String serviceTel) {
		this.serviceTel = serviceTel;
	}

	public String getShopBulletin() {
		return this.shopBulletin;
	}

	public void setShopBulletin(String shopBulletin) {
		this.shopBulletin = shopBulletin;
	}

	public String getShopDesc() {
		return this.shopDesc;
	}

	public void setShopDesc(String shopDesc) {
		this.shopDesc = shopDesc;
	}

	public String getShopLogo() {
		return this.shopLogo;
	}

	public void setShopLogo(String shopLogo) {
		this.shopLogo = shopLogo;
	}

	public String getShopName() {
		return this.shopName;
	}

	public void setShopName(String shopName) {
		this.shopName = shopName;
	}

	public String getShopShow() {
		return this.shopShow;
	}

	public void setShopShow(String shopShow) {
		this.shopShow = shopShow;
	}

	public String getShopStandardLogo() {
		return this.shopStandardLogo;
	}

	public void setShopStandardLogo(String shopStandardLogo) {
		this.shopStandardLogo = shopStandardLogo;
	}

	public BigDecimal getShopStyle() {
		return this.shopStyle;
	}

	public void setShopStyle(BigDecimal shopStyle) {
		this.shopStyle = shopStyle;
	}

	public String getShopTitle() {
		return this.shopTitle;
	}

	public void setShopTitle(String shopTitle) {
		this.shopTitle = shopTitle;
	}

	public String getShopType() {
		return this.shopType;
	}

	public void setShopType(String shopType) {
		this.shopType = shopType;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTaxRegisterNumber() {
		return this.taxRegisterNumber;
	}

	public void setTaxRegisterNumber(String taxRegisterNumber) {
		this.taxRegisterNumber = taxRegisterNumber;
	}

	public String getUnNeedSku() {
		return this.unNeedSku;
	}

	public void setUnNeedSku(String unNeedSku) {
		this.unNeedSku = unNeedSku;
	}

	public BigDecimal getUsedImgSpace() {
		return this.usedImgSpace;
	}

	public void setUsedImgSpace(BigDecimal usedImgSpace) {
		this.usedImgSpace = usedImgSpace;
	}

	public BigDecimal getUserId() {
		return this.userId;
	}

	public void setUserId(BigDecimal userId) {
		this.userId = userId;
	}

	public String getVideoImg() {
		return this.videoImg;
	}

	public void setVideoImg(String videoImg) {
		this.videoImg = videoImg;
	}

	public String getVideoUrl() {
		return this.videoUrl;
	}

	public void setVideoUrl(String videoUrl) {
		this.videoUrl = videoUrl;
	}

	public BigDecimal getVipDiscount() {
		return this.vipDiscount;
	}

	public void setVipDiscount(BigDecimal vipDiscount) {
		this.vipDiscount = vipDiscount;
	}

	public String getWithdrawalAccount() {
		return this.withdrawalAccount;
	}

	public void setWithdrawalAccount(String withdrawalAccount) {
		this.withdrawalAccount = withdrawalAccount;
	}

	public String getWithdrawalBank() {
		return this.withdrawalBank;
	}

	public void setWithdrawalBank(String withdrawalBank) {
		this.withdrawalBank = withdrawalBank;
	}

	public String getWithdrawalCity() {
		return this.withdrawalCity;
	}

	public void setWithdrawalCity(String withdrawalCity) {
		this.withdrawalCity = withdrawalCity;
	}

	public String getWithdrawalDesc() {
		return this.withdrawalDesc;
	}

	public void setWithdrawalDesc(String withdrawalDesc) {
		this.withdrawalDesc = withdrawalDesc;
	}

	public String getWithdrawalName() {
		return this.withdrawalName;
	}

	public void setWithdrawalName(String withdrawalName) {
		this.withdrawalName = withdrawalName;
	}

	public String getWithdrawalProvince() {
		return this.withdrawalProvince;
	}

	public void setWithdrawalProvince(String withdrawalProvince) {
		this.withdrawalProvince = withdrawalProvince;
	}

	public String getWw() {
		return this.ww;
	}

	public void setWw(String ww) {
		this.ww = ww;
	}

	public String getYm() {
		return this.ym;
	}

	public void setYm(String ym) {
		this.ym = ym;
	}

}