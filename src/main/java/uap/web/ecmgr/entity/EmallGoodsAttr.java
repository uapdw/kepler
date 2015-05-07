package uap.web.ecmgr.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigDecimal;


/**
 * The persistent class for the emall_goods_attr database table.
 * 
 */
@Entity
@Table(name="emall_goods_attr")
@NamedQuery(name="EmallGoodsAttr.findAll", query="SELECT e FROM EmallGoodsAttr e")
public class EmallGoodsAttr implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	@Column(name="attr_code")
	private String attrCode;

	@Column(name="attr_id")
	private BigDecimal attrId;

	@Column(name="attr_name")
	private String attrName;

	@Column(name="attr_value")
	private String attrValue;
/*
	@Column(name="goods_id")
	private BigDecimal goodsId;
*/	
	@Column(name="is_use")
	private BigDecimal isUse;

	private BigDecimal price;

	public EmallGoodsAttr() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAttrCode() {
		return this.attrCode;
	}

	public void setAttrCode(String attrCode) {
		this.attrCode = attrCode;
	}

	public BigDecimal getAttrId() {
		return this.attrId;
	}

	public void setAttrId(BigDecimal attrId) {
		this.attrId = attrId;
	}

	public String getAttrName() {
		return this.attrName;
	}

	public void setAttrName(String attrName) {
		this.attrName = attrName;
	}

	public String getAttrValue() {
		return this.attrValue;
	}

	public void setAttrValue(String attrValue) {
		this.attrValue = attrValue;
	}
/*
	public BigDecimal getGoodsId() {
		return this.goodsId;
	}

	public void setGoodsId(BigDecimal goodsId) {
		this.goodsId = goodsId;
	}
*/
	
	public long getGoodsId() {
		return this.good.getId();
	}

	public void setGoodsId(long goodsId) {
		this.good.setId(goodsId);
	}
//test
	@ManyToOne(cascade={CascadeType.PERSIST,CascadeType.MERGE,CascadeType.REFRESH})
	@JoinColumn(name="goods_id")
	private EmallGood good;

	public EmallGood getGood() {
		return this.good;
		
	}
	public void setGood(EmallGood good) {
		this.good=good;
		
	}
//end	
	public BigDecimal getIsUse() {
		return this.isUse;
	}

	public void setIsUse(BigDecimal isUse) {
		this.isUse = isUse;
	}

	public BigDecimal getPrice() {
		return this.price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

}