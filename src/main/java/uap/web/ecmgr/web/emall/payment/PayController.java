package uap.web.ecmgr.web.emall.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import uap.web.ecmgr.exception.BusiException;
import uap.web.ecmgr.service.emall.EmallPaymentOptLogService;
import uap.web.ecmgr.service.emall.EmallPaymentService;
import uap.web.ecmgr.web.emall.BaseController;

@Controller
@RequestMapping(value = "/emall/payment")
public class PayController extends BaseController{
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private EmallPaymentService payService;
	
	@Autowired
	EmallPaymentOptLogService logService;
	
	/**
	 * 付款服务调用
	 */
	@RequestMapping(value = "pay", method = RequestMethod.GET)
	public @ResponseBody String pay(Model model) {
		boolean result = true;
		long time3 = 0;
		long time1 = 0;
		long time2 = 0;
		long time4 = 0;
		String paylog = "";
		try {
			time1 = System.currentTimeMillis();
			paylog = payService.pay();
			time2 = System.currentTimeMillis();
			time3 = time2 - time1;
		} catch (BusiException e) {
			paylog = "fail call.";
			result = false;
			time4 = System.currentTimeMillis();
			time3 = time4 - time1;
			logger.error("付款服务调用失败，耗用时间为:",time3 + " 毫秒!");
		}
		//logService.log();
		logger.info("付款服务调用成功!");
		if(result)
			return "pay success! cost time = " + time3 + " ms." + paylog;
		else
			return "pay fail! cost time = " + time3 + " ms." + paylog;
	}

}
