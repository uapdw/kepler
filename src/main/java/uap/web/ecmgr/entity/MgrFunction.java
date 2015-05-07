package uap.web.ecmgr.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Transient;


/**
 * The persistent class for the mgr_function database table.
 * 
 */
@Entity
@Table(name="mgr_function")
@NamedQuery(name="MgrFunction.findAll", query="SELECT m FROM MgrFunction m")
public class MgrFunction implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private long id;

	@Column(name="create_date")
	private Timestamp createDate;

	@Column(name="func_code")
	private String funcCode;

	@Column(name="func_name")
	private String funcName;

	@Column(name="func_type")
	private String funcType;

	@Column(name="func_url")
	private String funcUrl;

	private String isactive;
	
	@Column(name="isleaf")
	private String isleaf;
	
	@Column(name="parent_id")
	private long parentId;

	@Transient
	private List<MgrFunction> children;
	
	public MgrFunction() {
	}
	
	public List<MgrFunction> getChildren() {
		return children;
	}

	public void setChildren(List<MgrFunction> children) {
		this.children = children;
	}

	public Long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Timestamp getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}

	public String getFuncCode() {
		return this.funcCode;
	}

	public void setFuncCode(String funcCode) {
		this.funcCode = funcCode;
	}

	public String getFuncName() {
		return this.funcName;
	}

	public void setFuncName(String funcName) {
		this.funcName = funcName;
	}

	public String getFuncType() {
		return this.funcType;
	}

	public void setFuncType(String funcType) {
		this.funcType = funcType;
	}

	public String getFuncUrl() {
		return this.funcUrl;
	}

	public void setFuncUrl(String funcUrl) {
		this.funcUrl = funcUrl;
	}

	public String getIsactive() {
		return this.isactive;
	}

	public void setIsactive(String isactive) {
		this.isactive = isactive;
	}

	public String getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(String isleaf) {
		this.isleaf = isleaf;
	}

	public long getParentId() {
		return parentId;
	}

	public void setParentId(long parentId) {
		this.parentId = parentId;
	}

}