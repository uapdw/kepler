package uap.ae.kepler.entity;

import java.io.Serializable;


/**
 * 挖掘模型
 * 
 * @author huoqi
 *
 */
public class DmModel implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * 主键
	 */
	private String pkDmModel;
	
	/**
	 * 项目主键
	 */
	private String pkProject;
	
	/**
	 * 工作流主键
	 */
	private String pkWorkflow;
	
	/**
	 * 模型名称
	 */
	private String modelName;
	
	/**
	 * 类型
	 */
	private int modelType;
	
	private String model;
	
	private String comments;
	
	private String creator;
	
	private String createTime;
	
	private String modifier;
	
	private String modifyTime;
	
	public String getPkDmModel() {
		return pkDmModel;
	}

	public void setPkDmModel(String pkDmModel) {
		this.pkDmModel = pkDmModel;
	}

	public String getPkProject() {
		return pkProject;
	}

	public void setPkProject(String pkProject) {
		this.pkProject = pkProject;
	}

	public String getPkWorkflow() {
		return pkWorkflow;
	}

	public void setPkWorkflow(String pkWorkflow) {
		this.pkWorkflow = pkWorkflow;
	}

	public String getModelName() {
		return modelName;
	}

	public void setModelName(String modelName) {
		this.modelName = modelName;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getModifier() {
		return modifier;
	}

	public void setModifier(String modifier) {
		this.modifier = modifier;
	}

	public String getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}

	public int getModelType() {
		return modelType;
	}

	public void setModelType(int modelType) {
		this.modelType = modelType;
	}
}
