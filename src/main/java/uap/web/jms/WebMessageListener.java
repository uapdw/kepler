package uap.web.jms;

import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.nosql.redis.JedisTemplate;

import uap.web.cache.nginx.NginxCacheController;

public class WebMessageListener implements MessageListener {

	private static Logger logger = LoggerFactory.getLogger(WebMessageListener.class);
	
	@Autowired
	private JedisTemplate jedisTemplate;
	
	@Autowired
	private NginxCacheController nginxCtrl;
	
	/**
	 * MessageListener回调函数.
	 */
	@Override
	public void onMessage(Message message) {
		try {
			MapMessage mapMessage = (MapMessage) message;
			// 打印消息详情
			logger.info("cacheFullKey:{}", mapMessage.getString("cacheFullKey"));
			String fullKey = mapMessage.getString("cacheFullKey");
			if(fullKey != null){
				clearCache(fullKey);
			}
		} catch (Exception e) {
			logger.error("处理消息时发生异常.", e);
		}
	}
	
	/**
	 * 清除Redis和nginx页面缓存
	 * 
	 * @param fullKey 页面缓存的全路径key
	 */
	private void clearCache(String fullKey) {
		String htmlCache = jedisTemplate.hget("goods", fullKey);
		if (htmlCache != null) {
			logger.info("清除前商品页面缓存内容为：" + htmlCache);
			jedisTemplate.hdel("goods", fullKey);
		} else {
			logger.info("Redis中无此页面内容，不需要清理。");
		}
		
		nginxCtrl.remove(fullKey);
	}

}
