package uap.web.ecmgr.entity;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;


@Entity
@Table(name="mgr_role")
@NamedQuery(name="MgrRole.findAll", query="SELECT m FROM MgrFunction m")
public class MgrRole implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private long id;
	
	@Column(name="role_name")
	private String roleName;

	@Column(name="role_code")
	private String roleCode;

	@Column(name="role_type")
	private String roleType;

	@Column(name="isactive")
	private String isActive;

	@Column(name="create_date")
	private Timestamp createDate;
	
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
	
	
	public String getRoleName() {
		return this.roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	
	public String getRoleCode() {
		return this.roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}
	
	
	public String getRoleType() {
		return this.roleType;
	}

	public void setRoleType(String roleType) {
		this.roleType = roleType;
	}
	public String getIsActive() {
		return this.isActive;
	}

	public void setgetIsActive(String isActive) {
		this.isActive = isActive;
	}
}
