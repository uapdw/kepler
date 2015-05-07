package uap.web.cache.service;

import java.lang.reflect.Field;
import java.util.HashMap;

import org.aspectj.lang.JoinPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springside.modules.nosql.redis.JedisTemplate;

import uap.web.cache.annotation.Clearable;
import uap.web.cache.nginx.NginxCacheController;
import uap.web.jms.WebMessageProducer;

/**
 * 商品更新aop清除缓存的服务
 * 
 * TODO : 待使用jms消息机制处理
 * 
 * @author liujmc
 * @version 2015-1-23
 */
public class ClearCacheService {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private JedisTemplate jedisTemplate;
	
	@Autowired
	private WebMessageProducer msgProducer;
	
	@Autowired
	private NginxCacheController nginxCtrl;

	public void clearCache(JoinPoint jp) {
		logger.info("被代理方法名字：" + jp.getSignature().getName());
		logger.info("被代理方法参数：" + jp.getArgs());
		logger.info("被代理对象：" + jp.getTarget());
		Object object = null;
		if(jp.getArgs().length > 0){
			object = jp.getArgs()[0];
		}
		if (object == null)
			return;
		try {
			if (object.getClass().getAnnotation(Clearable.class) != null) {
				Clearable annotation = object.getClass().getAnnotation(Clearable.class);
				String cacheKeyPrefix = annotation.url();
				String attrKey = annotation.attrbute();
				String attrValue = getAttrValueByKey(object, attrKey);
				String fullKey = cacheKeyPrefix + attrValue + ".shtml";
				logger.info("商品页面缓存key为：" + fullKey);
				
				// 发送jms消息
				HashMap<String,String> map = new HashMap<String,String>();
				map.put("cacheFullKey", fullKey);
				msgProducer.sendQueue(map);
				
				// clearCache(fullKey);
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("更新商品页面缓存失败.");
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

	private String getAttrValueByKey(Object good, String attrKey) {
		Field fields[] = good.getClass().getDeclaredFields();
		String[] name = new String[fields.length];
		Object[] value = new Object[fields.length];
		String result = null;
		try {
			Field.setAccessible(fields, true);
			for (int i = 0; i < name.length; i++) {
				name[i] = fields[i].getName();
				value[i] = fields[i].get(good);
				if(attrKey.equals(name[i]) && value[i]!=null){
					result = String.valueOf(value[i]);
					break;
				}
			}
		} catch (Exception e) {
			logger.error("获取属性值失败，属性名称是：" + attrKey + ".");
		}

		return result;
	}
}
