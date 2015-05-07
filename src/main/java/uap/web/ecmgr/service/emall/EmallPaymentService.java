package uap.web.ecmgr.service.emall;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import uap.web.ecmgr.exception.BusiException;

@Service
public class EmallPaymentService {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private JdbcTemplate jt;
	
	@Autowired
	EmallPaymentOptLogService logService;
	
	@Transactional(rollbackFor = BusiException.class)
	public String pay() throws BusiException {
		// 记录操作日志
		doOptLog();
		
		String userId = new Random().nextInt(10) + "";
		String goodId = "1170" + userId;
		String log = "user " + userId + " bought good " + goodId + ".";
		
		// 余额修改
		doChangeUserBalance(userId);
		
		// 商品数量修改
		doChangeGoodsNumber(goodId);
		
		// 积分记录表增加数额对应的积分
		doChangeScore();
		
		return log;
		
	}

	@Transactional(propagation = Propagation.SUPPORTS)
	private void doChangeScore() throws BusiException {
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat df=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time=df.format(date);
		int score = 100;
		String sql = "update payment_score set score=score+"+score+",paycount=paycount+"+score+",paynumber=paynumber+1,ts='"+time+"' where userid = 5";
		jt.execute(sql);
	}

	private void doOptLog() {
		logger.info("dolog call!");
		logService.log();
	}

	private void doChangeGoodsNumber(String goodId) throws BusiException{
		int hasGoodNum = getGoodsNum(goodId);
		if(hasGoodNum < 1)
			throw new BusiException();
		
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat df=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time=df.format(date);
		String sql = "update emall_goods set goods_number=goods_number-1,gmt_delisting='"+time+"' where id = " + goodId;
		jt.execute(sql);
	}

	@Transactional(propagation = Propagation.SUPPORTS)
	private void doChangeUserBalance(String userId) throws BusiException{
		int balance = 100;
		int hasBalance = getAccountBalance(userId);
		if(hasBalance - balance < 0){
			throw new BusiException();
		}
		Date date = new Date(System.currentTimeMillis());
		SimpleDateFormat df=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time=df.format(date);
		String sql = "update payment_balance set balance=balance-"+balance+",paynumber=paynumber+1,ts='"+time+"' where userid = " + userId;
		jt.execute(sql);
	}
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public int getAccountBalance(String userId) {
		int balance = jt.queryForObject("select balance from payment_balance where userid = "+ userId +" for update",Integer.class);
		return balance;
	}
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public int getGoodsNum(String goodId) {
		int goodNumber = jt.queryForObject("select goods_number from emall_goods where id = " +goodId+ " for update",Integer.class);
		return goodNumber;
	}
}
