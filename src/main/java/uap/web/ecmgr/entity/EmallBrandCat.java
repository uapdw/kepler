package uap.web.ecmgr.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigDecimal;


/**
 * The persistent class for the emall_brand_cat database table.
 * 
 */
@Entity
@Table(name="emall_brand_cat")
@NamedQuery(name="EmallBrandCat.findAll", query="SELECT e FROM EmallBrandCat e")
public class EmallBrandCat implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	@Column(name="brand_code")
	private String brandCode;

	@Column(name="cat_id")
	private BigDecimal catId;

	@Column(name="cat_level")
	private BigDecimal catLevel;

	@Column(name="customer_code")
	private String customerCode;

	@Column(name="shop_id")
	private BigDecimal shopId;

	public EmallBrandCat() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getBrandCode() {
		return this.brandCode;
	}

	public void setBrandCode(String brandCode) {
		this.brandCode = brandCode;
	}

	public BigDecimal getCatId() {
		return this.catId;
	}

	public void setCatId(BigDecimal catId) {
		this.catId = catId;
	}

	public BigDecimal getCatLevel() {
		return this.catLevel;
	}

	public void setCatLevel(BigDecimal catLevel) {
		this.catLevel = catLevel;
	}

	public String getCustomerCode() {
		return this.customerCode;
	}

	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}

	public BigDecimal getShopId() {
		return this.shopId;
	}

	public void setShopId(BigDecimal shopId) {
		this.shopId = shopId;
	}

}