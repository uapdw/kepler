package uap.ae.kepler.controller;

import java.io.File;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import uap.ae.kepler.entity.DataSources;
import uap.ae.kepler.service.AeDataSourceService;

/**
 * 数据源--Controller
 * 
 * @author huoqi
 *
 */
@Controller
@RequestMapping(value = "ae/dataSource")
public class DataSourceController {
	
	/** 上传目录名*/
	private static final String uploadFolderName = "uploads";

	private static final String MSG_SUCCESS = "success";
	private static final String MSG_ERROR = "error";
	private static final String DATA = "data";
	private static final String MSG = "msg";
	
	/** 允许上传的扩展名*/
	private static final String [] extensionPermit = {"txt", "xls", "csv", "xlsx"};
	
	@Autowired
	private AeDataSourceService service;
	
	@RequestMapping(value = "upload", method = RequestMethod.POST)
	public @ResponseBody JSONObject upload(@RequestParam("uploadfile") CommonsMultipartFile file, 
			HttpServletRequest request) throws Exception{
		HttpSession session = request.getSession();
		//清除上次上传进度信息
		String curProjectPath = session.getServletContext().getRealPath("/");
		String saveDirectoryPath = curProjectPath + "/" + uploadFolderName;
		File saveDirectory = new File(saveDirectoryPath);
		JSONObject json = new JSONObject();
		if(!(saveDirectory.isDirectory() || saveDirectory.mkdir())){
			json.put(MSG, MSG_ERROR);
			return json;
		}
		
		String oldFileName = null;
		String newFileName = null;
		String fileExtension = null;
		// 判断文件是否存在
		if (!file.isEmpty()) {
			oldFileName = file.getOriginalFilename();
			fileExtension = FilenameUtils.getExtension(oldFileName);
			if(!ArrayUtils.contains(extensionPermit, fileExtension)) {
				json.put(MSG, MSG_ERROR);
				return json;
			}
			UUID uuid = UUID.randomUUID();
			String fileId=uuid.toString();
			newFileName = fileId + "." + fileExtension;
			file.transferTo(new File(saveDirectory, newFileName));
		}
		
		if(StringUtils.isNotEmpty(newFileName)){
			DataSources entity = new DataSources();
			entity.setName(oldFileName);
			entity.setFileName(newFileName);
			entity.setFileType(fileExtension);
	    	try {
	    		service.saveEntity(entity);
			} catch (Exception e) {
				json.put(DATA, e.getMessage());
				json.put(MSG, MSG_ERROR);
				return json;
			}
			json.put(DATA, newFileName);
			json.put(MSG, MSG_SUCCESS);
		}else{
			json.put(MSG, MSG_ERROR);
		}
		
		return json;
	}

}
