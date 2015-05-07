package uap.web.ecmgr.jms;

import java.io.Serializable;
import java.util.Map;

public class JmsMessage implements Serializable{

	private static final long serialVersionUID = 186183009867680751L;
	
	private String type;
	
	private Map msgContent;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Map getMsgContent() {
		return msgContent;
	}

	public void setMsgContent(Map msgContent) {
		this.msgContent = msgContent;
	}

}
