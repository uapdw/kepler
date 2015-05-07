package uap.ae.kepler.controller;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import uap.web.ecmgr.web.emall.BaseController;

/**
 * 首页--Controller
 * 
 * @author huoqi
 *
 */
@Controller
@RequestMapping(value = "ae/homepage")
public class HomePageController extends BaseController {

	@RequestMapping(value = "initInfo", method = RequestMethod.GET)
	public @ResponseBody JSONObject page(
			@RequestParam(value = "param", defaultValue = "1") String param, HttpServletRequest request) {
		JSONObject result = new JSONObject();
		result.put("name", "I am " + param);
		result.put("city", "Beijing");
		return result;
	}
}
