package uap.web.ecmgr.web.emall.shopinfo;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.beanvalidator.BeanValidators;
import org.springside.modules.persistence.SearchFilter.Operator;

import uap.web.ecmgr.entity.EmallShopInfo;
import uap.web.ecmgr.entity.User;
import uap.web.ecmgr.service.account.AccountService;
import uap.web.ecmgr.service.emall.EmallShopInfoService;
import uap.web.ecmgr.web.emall.BaseController;
import uap.web.mail.EmallMailService;

@Controller
@RequestMapping(value = "/emall/shop")
public class ShopInfoController extends BaseController {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private EmallShopInfoService shopService;

	@Autowired
	private AccountService accountService;

	@Autowired
	private EmallMailService mailService;

	@Autowired
	private Validator validator;

	@RequestMapping(value = "page", method = RequestMethod.GET)
	public @ResponseBody Page<EmallShopInfo> page(
			@RequestParam(value = "page", defaultValue = "1") int pageNumber,
			@RequestParam(value = "page.size", defaultValue = "10") int pageSize,
			@RequestParam(value = "sortType", defaultValue = "auto") String sortType,
			Model model, ServletRequest request) {

		Map<String, Object> searchParams = new HashMap<String, Object>();
		String e = request.getParameter("status");

		String test = "6";
		if (test.equals(e)) {

			String queryCon = request.getParameter("shopTitle");

			String a = request.getParameter("email");
			String b = request.getParameter("companyName");
			String c = request.getParameter("phone");
			String d = "6";
			searchParams.put(Operator.LIKE + "_status", d);
			searchParams.put(Operator.LIKE + "_shopTitle", queryCon);
			searchParams.put(Operator.LIKE + "_email", a);
			searchParams.put(Operator.LIKE + "_companyName", b);
			searchParams.put(Operator.LIKE + "_phone", c);

			PageRequest pageRequest = buildPageRequest(pageNumber, pageSize,
					sortType);

			Page<EmallShopInfo> categoryPage = shopService.getshopPage(
					searchParams, pageRequest);
			return categoryPage;
		} else {
			String queryCon = request.getParameter("shopTitle");

			String a = request.getParameter("email");
			String b = request.getParameter("companyName");
			String c = request.getParameter("phone");
			String d = "0";
			searchParams.put(Operator.LIKE + "_status", d);
			searchParams.put(Operator.LIKE + "_shopTitle", queryCon);
			searchParams.put(Operator.LIKE + "_email", a);
			searchParams.put(Operator.LIKE + "_companyName", b);
			searchParams.put(Operator.LIKE + "_phone", c);

			PageRequest pageRequest = buildPageRequest(pageNumber, pageSize,
					sortType);

			Page<EmallShopInfo> categoryPage = shopService.getshopPage(
					searchParams, pageRequest);
			return categoryPage;
		}

	}

	/** 进入新增 */
	@RequestMapping(value = "create", method = RequestMethod.GET)
	public @ResponseBody EmallShopInfo add() {
		EmallShopInfo entity = new EmallShopInfo();
		return entity;
	}

	/** 保存新增 */
	@RequestMapping(value = "create", method = RequestMethod.POST)
	public @ResponseBody EmallShopInfo create(
			@RequestBody EmallShopInfo entity, HttpServletRequest resq) {

		BeanValidators.validateWithException(validator, entity);
		try {
			entity = shopService.saveEntity(entity);
		} catch (Exception e) {
			// 记录日志
			logger.error("保存出错!", e);
		}
		return entity;
	}

	/**
	 * 进入更新界面
	 * 
	 * @param id
	 * @param model
	 * @return 需要更新的实体的json结构
	 */
	@RequestMapping(value = "update/{id}", method = RequestMethod.GET)
	public @ResponseBody EmallShopInfo updateForm(@PathVariable("id") Long id,
			Model model) {
		EmallShopInfo entity = shopService.getEmallShopById(id);
		return entity;
	}

	/** 保存更新 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public @ResponseBody EmallShopInfo update(@RequestBody EmallShopInfo entity) {
		try {
			entity = shopService.saveEntity(entity);
		} catch (Exception e) {
			logger.error("更新出错!", e);
		}
		return entity;
	}

	/**
	 * 删除实体
	 * 
	 * @param id
	 *            删除的标识
	 * @return 是否删除成功
	 */
	@RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
	public @ResponseBody boolean delete(@PathVariable("id") Long id) {
		shopService.deleteById(id);
		return true;
	}

	/** 保存新增 */
	@RequestMapping(value = "approve/{id}", method = RequestMethod.POST)
	public @ResponseBody boolean approve(@PathVariable("id") Long id,
			@RequestBody HashMap<String, String> approve,
			HttpServletRequest resq) {
		try {
			EmallShopInfo shop = shopService.getEmallShopById(id);
			shop.setStatus("6");
			shopService.saveEntity(shop);
			User newUser = new User();
			newUser.setLoginName("custom_" + new Random().nextInt(1000));
			newUser.setName(shop.getShopName());
			newUser.setPlainPassword("111111");
			logger.info("审核意见：" + approve.get("content"));
			accountService.registerCustomUser(newUser);

			// 暂时同步，应jms
			mailService.sendNotificationMail(newUser);
		} catch (Exception e) {
			// 记录日志
			logger.error("审批出错!", e);
			return false;
		}
		return true;
	}
}
