package uap.web.ecmgr.service.emall;

import java.sql.Date;
import java.text.SimpleDateFormat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmallPaymentOptLogService {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private JdbcTemplate jt;
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void log() {
		try {
			// 记录操作日志
			doOptLog();
		} catch (Exception e) {
			logger.error("记录日志失败", e);
		}
	}

	private void doOptLog() {
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat df=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time=df.format(date);
		String sql = "insert into payment_optlog(userid,operate,opttype,ts) values(5,'pay','goods','"+time+"')";
		jt.execute(sql);
	}
}
