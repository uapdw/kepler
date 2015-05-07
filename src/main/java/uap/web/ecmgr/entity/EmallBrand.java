package uap.web.ecmgr.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.sql.Timestamp;
import java.math.BigDecimal;


/**
 * The persistent class for the emall_brand database table.
 * 
 */
@Entity
@Table(name="emall_brand")
@NamedQuery(name="EmallBrand.findAll", query="SELECT e FROM EmallBrand e")
public class EmallBrand implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
//	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	@Column(name="brand_cate")
	private BigDecimal brandCate;

	@Lob
	@Column(name="brand_desc")
	private String brandDesc;

	@Column(name="brand_logo")
	private String brandLogo;

	@Column(name="brand_name")
	private String brandName;

	@Column(name="brand_pinyin")
	private String brandPinyin;

	@Column(name="brand_weight")
	private BigDecimal brandWeight;

	private String country;

	@Column(name="erp_brand_id")
	private String erpBrandId;

	@Column(name="gmt_create")
	private Timestamp gmtCreate;

	@Column(name="gmt_modify")
	private Timestamp gmtModify;

	@Column(name="is_local")
	private BigDecimal isLocal;

	@Column(name="is_recommend")
	private BigDecimal isRecommend;

	@Column(name="is_show")
	private BigDecimal isShow;

	private String link;

	@Column(name="shop_id")
	private BigDecimal shopId;

	private BigDecimal sort;

	private BigDecimal status;

	public EmallBrand() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public BigDecimal getBrandCate() {
		return this.brandCate;
	}

	public void setBrandCate(BigDecimal brandCate) {
		this.brandCate = brandCate;
	}

	public String getBrandDesc() {
		return this.brandDesc;
	}

	public void setBrandDesc(String brandDesc) {
		this.brandDesc = brandDesc;
	}

	public String getBrandLogo() {
		return this.brandLogo;
	}

	public void setBrandLogo(String brandLogo) {
		this.brandLogo = brandLogo;
	}

	public String getBrandName() {
		return this.brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	public String getBrandPinyin() {
		return this.brandPinyin;
	}

	public void setBrandPinyin(String brandPinyin) {
		this.brandPinyin = brandPinyin;
	}

	public BigDecimal getBrandWeight() {
		return this.brandWeight;
	}

	public void setBrandWeight(BigDecimal brandWeight) {
		this.brandWeight = brandWeight;
	}

	public String getCountry() {
		return this.country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getErpBrandId() {
		return this.erpBrandId;
	}

	public void setErpBrandId(String erpBrandId) {
		this.erpBrandId = erpBrandId;
	}

	public Timestamp getGmtCreate() {
		return this.gmtCreate;
	}

	public void setGmtCreate(Timestamp gmtCreate) {
		this.gmtCreate = gmtCreate;
	}

	public Timestamp getGmtModify() {
		return this.gmtModify;
	}

	public void setGmtModify(Timestamp gmtModify) {
		this.gmtModify = gmtModify;
	}

	public BigDecimal getIsLocal() {
		return this.isLocal;
	}

	public void setIsLocal(BigDecimal isLocal) {
		this.isLocal = isLocal;
	}

	public BigDecimal getIsRecommend() {
		return this.isRecommend;
	}

	public void setIsRecommend(BigDecimal isRecommend) {
		this.isRecommend = isRecommend;
	}

	public BigDecimal getIsShow() {
		return this.isShow;
	}

	public void setIsShow(BigDecimal isShow) {
		this.isShow = isShow;
	}

	public String getLink() {
		return this.link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public BigDecimal getShopId() {
		return this.shopId;
	}

	public void setShopId(BigDecimal shopId) {
		this.shopId = shopId;
	}

	public BigDecimal getSort() {
		return this.sort;
	}

	public void setSort(BigDecimal sort) {
		this.sort = sort;
	}

	public BigDecimal getStatus() {
		return this.status;
	}

	public void setStatus(BigDecimal status) {
		this.status = status;
	}

}