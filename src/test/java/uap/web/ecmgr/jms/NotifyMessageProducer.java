/*******************************************************************************
 * Copyright (c) 2005, 2014 springside.github.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *******************************************************************************/
package uap.web.ecmgr.jms;

import java.util.HashMap;
import java.util.Map;

import javax.jms.Destination;

import org.springframework.jms.core.JmsTemplate;

/**
 * JMS用户变更消息生产者.
 * 
 * 使用jmsTemplate将用户变更消息分别发送到queue与topic.
 * 
 * @author calvin
 */

public class NotifyMessageProducer {

	private JmsTemplate jmsTemplate;
	private Destination notifyQueue;

	public void sendQueue(final Map map) {
		sendMessage(map, notifyQueue);
	}

	/**
	 * 使用jmsTemplate最简便的封装convertAndSend()发送Map类型的消息.
	 */
	private void sendMessage(Map user, Destination destination) {
		Map map = new HashMap();
		map.put("userName", user.get("userName"));
		map.put("email", user.get("email"));

		jmsTemplate.convertAndSend(destination, map);
	}

	public void setJmsTemplate(JmsTemplate jmsTemplate) {
		this.jmsTemplate = jmsTemplate;
	}

	public void setNotifyQueue(Destination notifyQueue) {
		this.notifyQueue = notifyQueue;
	}
}
