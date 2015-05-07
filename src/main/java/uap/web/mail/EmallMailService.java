package uap.web.mail;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import uap.web.ecmgr.entity.User;

@Service
public class EmallMailService {
	private static Logger logger = LoggerFactory.getLogger(EmallMailService.class);

	@Autowired
	private JavaMailSender mailSender;

	/**
	 * 发送纯文本的用户修改通知邮件.
	 */
	public void sendNotificationMail(User user) {
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setFrom("ecmgradmin@126.com");
		msg.setTo("liujmc@yonyou.com");
		msg.setSubject("店铺创建成功通知" + new Date());

		String content = user.getName() + " 您好!您申请的店铺创建成功!登录账号为"+ user.getLoginName() + "，初始密码为：" + user.getPlainPassword()+"，登录地址为：http://localhost:8081/ecmgr，请妥善保存!";
		msg.setText(content);
		try {
			// 待使用jms消息管理邮件发送
			mailSender.send(msg);
			if (logger.isInfoEnabled()) {
				logger.info("纯文本邮件已发送至{}", StringUtils.join(msg.getTo(), ","));
			}
		} catch (Exception e) {
			logger.error("发送邮件失败", e);
		}
	}

	/**
	 * Spring的MailSender.
	 */
	public void setMailSender(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}
}
