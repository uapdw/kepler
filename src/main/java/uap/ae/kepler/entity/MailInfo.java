package uap.ae.kepler.entity;

import java.io.Serializable;

import javax.persistence.Entity;

@Entity
public class MailInfo implements Serializable{

	private String toList;
	private String title;
	private String content;
	private String fileUrl;
	public String[] getToList() {
		return toList.split(";"); //TODO
	}
	public void setToList(String toList) {
		this.toList = toList;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getFileUrl() {
		return fileUrl;
	}
	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}
}
