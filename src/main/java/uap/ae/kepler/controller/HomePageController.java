package uap.ae.kepler.controller;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
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
	public @ResponseBody JSONArray page(
			@RequestParam(value = "param", defaultValue = "1") String param, HttpServletRequest request) {
		JSONArray resultJsons = new JSONArray();

		String mJsonStr = readFile(HomePageController.class.getResource("datam.json").getPath());
		JSONObject mJsonObject = JSONObject.fromObject(mJsonStr);
		resultJsons.add(mJsonObject);
		
		mJsonStr = readFile(HomePageController.class.getResource("datagdp.json").getPath());
		JSONArray jsonArray = JSONArray.fromObject(mJsonStr);
		resultJsons.add(jsonArray);
		
		mJsonStr = readFile(HomePageController.class.getResource("weibo.json").getPath());
		JSONObject jsonWeibo= JSONObject.fromObject(mJsonStr);
		resultJsons.add(jsonWeibo);
		
		return resultJsons;
	}
	

	public String readFile(String Path) {
		BufferedReader reader = null;
		String laststr = "";
		try {
			FileInputStream fileInputStream = new FileInputStream(Path);
			InputStreamReader inputStreamReader = new InputStreamReader(
					fileInputStream, "UTF-8");
			reader = new BufferedReader(inputStreamReader);
			String tempString = null;
			while ((tempString = reader.readLine()) != null) {
				laststr += tempString;
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return laststr;
	}

}
