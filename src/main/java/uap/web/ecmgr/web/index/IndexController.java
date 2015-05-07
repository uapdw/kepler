package uap.web.ecmgr.web.index;

import org.apache.shiro.SecurityUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import uap.web.ecmgr.service.account.ShiroDbRealm.ShiroUser;

/**
 * 
 * 首页面
 */
@Controller
@RequestMapping(value = "/")
public class IndexController {

	@RequestMapping(method = RequestMethod.GET)
	public String index(ModelMap model) {
		ShiroUser cuser = null;
		if (SecurityUtils.getSubject().getPrincipal() != null)
			cuser = (ShiroUser) SecurityUtils.getSubject().getPrincipal();
		model.addAttribute("cusername", cuser.getName());
		return "index";
	}

	@RequestMapping(method = RequestMethod.GET, value = "register")
	public String register(ModelMap model) {
		return "emall/register/shopWizard";
	}
}
