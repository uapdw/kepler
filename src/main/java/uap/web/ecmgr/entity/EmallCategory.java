package uap.web.ecmgr.entity;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;



/**
 * The persistent class for the emall_category database table.
 * 
 */
@Entity
@Table(name="emall_category")
@NamedQuery(name="EmallCategory.findAll", query="SELECT e FROM EmallCategory e")
public class EmallCategory implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column(name="cat_code")
	private String catCode;

	@Column(name="cat_desc")
	private String catDesc;

	@Column(name="cat_name")
	private String catName;

	@Column(name="cat_type")
	private BigDecimal catType;

	@Column(name="child_nums")
	private BigDecimal childNums;

	private BigDecimal depth;

	@Column(name="is_deleted")
	private String isDeleted;

	@Column(name="is_dummy")
	private BigDecimal isDummy;

	@Column(name="is_fragile")
	private BigDecimal isFragile;

	@Column(name="is_leaf")
	private BigDecimal isLeaf;

	@Column(name="is_search")
	private BigDecimal isSearch;

	@Column(name="is_show")
	private BigDecimal isShow;

	@Column(name="parent_code")
	private String parentCode;

	@Column(name="pic_path")
	private String picPath;

	@Column(name="point_proportion")
	private BigDecimal pointProportion;

	@Column(name="sort_order")
	private BigDecimal sortOrder;

	@Column(name="style_type")
	private BigDecimal styleType;

	public EmallCategory() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getCatCode() {
		return this.catCode;
	}

	public void setCatCode(String catCode) {
		this.catCode = catCode;
	}

	public String getCatDesc() {
		return this.catDesc;
	}

	public void setCatDesc(String catDesc) {
		this.catDesc = catDesc;
	}

	public String getCatName() {
		return this.catName;
	}

	public void setCatName(String catName) {
		this.catName = catName;
	}

	public BigDecimal getCatType() {
		return this.catType;
	}

	public void setCatType(BigDecimal catType) {
		this.catType = catType;
	}

	public BigDecimal getChildNums() {
		return this.childNums;
	}

	public void setChildNums(BigDecimal childNums) {
		this.childNums = childNums;
	}

	public BigDecimal getDepth() {
		return this.depth;
	}

	public void setDepth(BigDecimal depth) {
		this.depth = depth;
	}

	public String getIsDeleted() {
		return this.isDeleted;
	}

	public void setIsDeleted(String isDeleted) {
		this.isDeleted = isDeleted;
	}

	public BigDecimal getIsDummy() {
		return this.isDummy;
	}

	public void setIsDummy(BigDecimal isDummy) {
		this.isDummy = isDummy;
	}

	public BigDecimal getIsFragile() {
		return this.isFragile;
	}

	public void setIsFragile(BigDecimal isFragile) {
		this.isFragile = isFragile;
	}

	public BigDecimal getIsLeaf() {
		return this.isLeaf;
	}

	public void setIsLeaf(BigDecimal isLeaf) {
		this.isLeaf = isLeaf;
	}

	public BigDecimal getIsSearch() {
		return this.isSearch;
	}

	public void setIsSearch(BigDecimal isSearch) {
		this.isSearch = isSearch;
	}

	public BigDecimal getIsShow() {
		return this.isShow;
	}

	public void setIsShow(BigDecimal isShow) {
		this.isShow = isShow;
	}

	public String getParentCode() {
		return this.parentCode;
	}

	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}

	public String getPicPath() {
		return this.picPath;
	}

	public void setPicPath(String picPath) {
		this.picPath = picPath;
	}

	public BigDecimal getPointProportion() {
		return this.pointProportion;
	}

	public void setPointProportion(BigDecimal pointProportion) {
		this.pointProportion = pointProportion;
	}

	public BigDecimal getSortOrder() {
		return this.sortOrder;
	}

	public void setSortOrder(BigDecimal sortOrder) {
		this.sortOrder = sortOrder;
	}

	public BigDecimal getStyleType() {
		return this.styleType;
	}

	public void setStyleType(BigDecimal styleType) {
		this.styleType = styleType;
	}

}