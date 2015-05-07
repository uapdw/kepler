package uap.web.jms;

import java.util.Map;

import javax.jms.Destination;

import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings({"rawtypes"})
public class WebMessageProducer {
	private JmsTemplate jmsTemplate;
	private Destination notifyQueue;

	public void setJmsTemplate(JmsTemplate jmsTemplate) {
		this.jmsTemplate = jmsTemplate;
	}

	public void setNotifyQueue(Destination notifyQueue) {
		this.notifyQueue = notifyQueue;
	}
	
	public void sendQueue(final Map map) {
		jmsTemplate.convertAndSend(notifyQueue, map);
	}

}
