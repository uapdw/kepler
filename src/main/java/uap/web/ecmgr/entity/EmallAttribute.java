package uap.web.ecmgr.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.math.BigDecimal;

/**
 * The persistent class for the emall_attribute database table.
 * 
 */
@Entity
@Table(name = "emall_attribute")
@NamedQuery(name = "EmallAttribute.findAll", query = "SELECT e FROM EmallAttribute e")
public class EmallAttribute implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	// @GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	@Column(name = "attr_code")
	private String attrCode;

	@Column(name = "attr_desc")
	private String attrDesc;

	@Column(name = "attr_name")
	private String attrName;

	@Column(name = "attr_values")
	private String attrValues;

	@Column(name = "group_id")
	private BigDecimal groupId;

	@Column(name = "input_type")
	private String inputType;

	@Column(name = "is_buyer_choose")
	private BigDecimal isBuyerChoose;

	@Column(name = "is_guide")
	private BigDecimal isGuide;

	@Column(name = "is_index")
	private BigDecimal isIndex;

	@Column(name = "is_need")
	private BigDecimal isNeed;

	@Column(name = "is_rel_child")
	private String isRelChild;

	@Column(name = "is_screening_condition")
	private String isScreeningCondition;

	private BigDecimal status;

	public EmallAttribute() {
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

	public String getAttrDesc() {
		return this.attrDesc;
	}

	public void setAttrDesc(String attrDesc) {
		this.attrDesc = attrDesc;
	}

	public String getAttrName() {
		return this.attrName;
	}

	public void setAttrName(String attrName) {
		this.attrName = attrName;
	}

	public String getAttrValues() {
		return this.attrValues;
	}

	public void setAttrValues(String attrValues) {
		this.attrValues = attrValues;
	}

	public BigDecimal getGroupId() {
		return this.groupId;
	}

	public void setGroupId(BigDecimal groupId) {
		this.groupId = groupId;
	}

	public String getInputType() {
		return this.inputType;
	}

	public void setInputType(String inputType) {
		this.inputType = inputType;
	}

	public BigDecimal getIsBuyerChoose() {
		return this.isBuyerChoose;
	}

	public void setIsBuyerChoose(BigDecimal isBuyerChoose) {
		this.isBuyerChoose = isBuyerChoose;
	}

	public BigDecimal getIsGuide() {
		return this.isGuide;
	}

	public void setIsGuide(BigDecimal isGuide) {
		this.isGuide = isGuide;
	}

	public BigDecimal getIsIndex() {
		return this.isIndex;
	}

	public void setIsIndex(BigDecimal isIndex) {
		this.isIndex = isIndex;
	}

	public BigDecimal getIsNeed() {
		return this.isNeed;
	}

	public void setIsNeed(BigDecimal isNeed) {
		this.isNeed = isNeed;
	}

	public String getIsRelChild() {
		return this.isRelChild;
	}

	public void setIsRelChild(String isRelChild) {
		this.isRelChild = isRelChild;
	}

	public String getIsScreeningCondition() {
		return this.isScreeningCondition;
	}

	public void setIsScreeningCondition(String isScreeningCondition) {
		this.isScreeningCondition = isScreeningCondition;
	}

	public BigDecimal getStatus() {
		return this.status;
	}

	public void setStatus(BigDecimal status) {
		this.status = status;
	}

}