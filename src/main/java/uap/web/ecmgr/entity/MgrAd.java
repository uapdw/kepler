package uap.web.ecmgr.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;



/**
 * The persistent class for the emall_goods database table.
 * 
 */
@Entity
@Table(name = "emall_ad_info")
@NamedQuery(name = "MgrAd.findAll", query = "SELECT e FROM MgrAd e")
public class MgrAd implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	// @GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "title")
	private String title;
	
	@Column(name = "type")
	private BigDecimal type;
	
	@Column(name = "sort")
	private BigDecimal sort;
	
	@Column(name = "image")
	private String image;

	@Column(name = "name")
	private String name;
	
	@Column(name = "isactive")
	private String isActive;
	
	@Column(name = "businessid")
	private String businessId;
	
	@Column(name = "create_date")
	private Timestamp create_date;
	
	public MgrAd(){
		
	}
	public long getId(){
		return this.id;
	}
	public void setId(long id){
		this.id=id;
	}
	
	public String getTitle(){
		return this.title;
	}
	public void setTitle(String title){
		this.title=title;
	}
	
	public BigDecimal getType(){
		return this.type;
	}
	public void setType(BigDecimal type){
		this.type=type;
	}
	
	public BigDecimal getSort(){
		return this.sort;
	}
	public void setSort(BigDecimal sort){
		this.sort=sort;
	}
	
	public String getImage(){
		return this.image;
	}
	public void setImage(String image){
		this.image=image;
	}
	
	public String getName(){
		return this.name;
	}
	public void setName(String name){
		this.name=name;
	}
	
	public String getIsActive(){
		return this.isActive;
	}
	public void setIsActive(String isActive){
		this.isActive=isActive;
	}
	
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+08:00")
	public Timestamp getCreatetime(){
		return this.create_date;
	}
	public void setCreatetime(Timestamp createtime){
		this.create_date=createtime;
	}
	public String getBusinessId() {
		return businessId;
	}
	public void setBusinessId(String businessId) {
		this.businessId = businessId;
	}
}	
