package uap.web.ecmgr.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.sql.Time;


/**
 * The persistent class for the emall_admgr database table.
 * 
 */
@Entity
@Table(name="emall_admgr")
@NamedQuery(name="EmallAdmgr.findAll", query="SELECT e FROM EmallAdmgr e")
public class EmallAdmgr implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
//	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	private Time createdate;

	private String creator;

	private String href;

	private String name;

	private int adorder;

	public EmallAdmgr() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Time getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Time createdate) {
		this.createdate = createdate;
	}

	public String getCreator() {
		return this.creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getHref() {
		return this.href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAdorder() {
		return this.adorder;
	}

	public void setAdorder(int order) {
		this.adorder = order;
	}

}