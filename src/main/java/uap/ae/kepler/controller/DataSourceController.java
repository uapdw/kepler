package uap.ae.kepler.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 数据源--Controller
 * 
 * @author huoqi
 *
 */
@Controller
@RequestMapping(value = "ae/datasource")
public class DataSourceController {
	@RequestMapping(value = "show", method = RequestMethod.GET)
	public @ResponseBody String show(HttpServletRequest request) {
		return "show";
	}
}
