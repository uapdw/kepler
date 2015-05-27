package uap.ae.kepler.service;

import java.io.File;
import java.util.Date;

import javax.mail.internet.MimeMessage;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import uap.ae.kepler.entity.MailInfo;

@Service
public class MailService {
	private static Logger logger = LoggerFactory.getLogger(MailService.class);

	@Autowired
	private JavaMailSender mailSender;

	/**
	 * 发送纯文本的用户修改通知邮件.
	 */
	public boolean sendNotificationMail(MailInfo mailInfo) {
//		SimpleMailMessage msg = new SimpleMailMessage();
//		msg.setFrom("ecmgradmin@126.com");
//		msg.setTo(mailInfo.getToList());
//		msg.setSubject(mailInfo.getTitle());
//
//		String content = String.format("<html><body>%s<br/><img src='%s'></body></html>", mailInfo.getContent(), mailInfo.getFileUrl());
//		msg.setText(content);
		try {
			MimeMessage msg = mailSender.createMimeMessage();
			MimeMessageHelper messHelper = new MimeMessageHelper(msg, true);
			messHelper.setFrom("ecmgradmin@126.com");
			messHelper.setTo(mailInfo.getToList());
			messHelper.setSubject(mailInfo.getTitle());
			String content = String.format("<html><body>%s<br/><img src='cid:attachment1'></body></html>", mailInfo.getContent());
			messHelper.setText(content, true);
			FileSystemResource img = new FileSystemResource(new File(mailInfo.getFileUrl()));
			messHelper.addInline("attachment1", img);
			// 待使用jms消息管理邮件发送
			mailSender.send(msg);
			if (logger.isInfoEnabled()) {
				logger.info("纯文本邮件已发送至{}", StringUtils.join(mailInfo.getToList(), ","));
			}
		} catch (Exception e) {
			logger.error("发送邮件失败", e);
			return false;
		}
		return true;
	}

	/**
	 * Spring的MailSender.
	 */
	public void setMailSender(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}
}
