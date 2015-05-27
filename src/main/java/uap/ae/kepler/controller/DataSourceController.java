package uap.ae.kepler.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import uap.ae.kepler.csv.CsvReader;
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
	private static final String COLNUM = "colnum";
	private static final String ROWNUM = "rownum";
	private static final String MSG = "msg";
	
	/** 允许上传的扩展名*/
	private static final String [] extensionPermit = {"txt", "xls", "csv", "xlsx"};
	
	@Autowired
	private AeDataSourceService service;
	
	@RequestMapping(value = "list", method = RequestMethod.GET)
	public @ResponseBody JSONObject list(HttpServletRequest request) {
		List<DataSources> dbs = service.findAll();
		JSONArray array = new JSONArray();
		array.addAll(dbs);
		JSONObject o = new JSONObject();
		o.put(DATA, array);
		o.put(MSG, MSG_SUCCESS);
		return o;
	}
	
	@RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
	public @ResponseBody JSONObject delete(@PathVariable("id") Long id, HttpServletRequest request) {
		DataSources ds = service.findOne(id);
		String fileName = ds.getFileName();
		service.deleteOne(id);
		HttpSession session = request.getSession();
		String curProjectPath = session.getServletContext().getRealPath("/");
		String saveDirectoryPath = curProjectPath + "/" + uploadFolderName;
		File saveDirectory = new File(saveDirectoryPath);
		JSONObject json = new JSONObject();
		if(!(saveDirectory.isDirectory() || saveDirectory.mkdir())){
			json.put(MSG, MSG_ERROR);
			return json;
		}
		File file = new File(saveDirectory, fileName);
		if(file.delete()){
			json.put(MSG, MSG_SUCCESS);
		}else{
			json.put(MSG, MSG_ERROR);
		}
		return json;
	}
	
	@RequestMapping(value = "info/{id}", method = RequestMethod.GET)
	public @ResponseBody JSONObject info(@PathVariable("id") Long id, HttpServletRequest request) {
		DataSources ds = service.findOne(id);
		String fileName = ds.getFileName();
		HttpSession session = request.getSession();
		String curProjectPath = session.getServletContext().getRealPath("/");
		String saveDirectoryPath = curProjectPath + "/" + uploadFolderName;
		File saveDirectory = new File(saveDirectoryPath);
		JSONObject json = new JSONObject();
		if(!(saveDirectory.isDirectory() || saveDirectory.mkdir())){
			json.put(MSG, MSG_ERROR);
			return json;
		}
		
		BufferedReader reader = null;
		try {
			File file = new File(saveDirectory, fileName);
			reader = new BufferedReader(new FileReader(file));
			List<String[]> datalist = new ArrayList();
			int rownum = 0;
			int colnum = -1;
			CsvReader csvReader = new CsvReader(reader);
			while(csvReader.readRecord()){
				colnum = (colnum < csvReader.getColumnCount())? csvReader.getColumnCount() : colnum;
				datalist.add(csvReader.getValues());
				rownum++;
			}
			json.put(DATA, datalist);
			json.put(COLNUM, colnum);
			json.put(ROWNUM, rownum);
			json.put(MSG, MSG_SUCCESS);
		} catch (FileNotFoundException e) {
			json.put(MSG, "文件不存在");
		} catch (IOException e) {
			json.put(MSG, "IO错误");
		} finally{
			if(reader != null){
				try {
					reader.close();
				} catch (IOException e) {
					json.put(MSG, "IO错误");
				}
			}
		}
		return json;
	}
	
	@RequestMapping(value = "select/{id}", method = RequestMethod.GET)
	public @ResponseBody JSONObject select(@PathVariable("id") Long id, HttpServletRequest request) {
		DataSources ds = service.findOne(id);
		String fileName = ds.getFileName();
		HttpSession session = request.getSession();
		String curProjectPath = session.getServletContext().getRealPath("/");
		String saveDirectoryPath = curProjectPath + "/" + uploadFolderName;
		File saveDirectory = new File(saveDirectoryPath);
		JSONObject json = new JSONObject();
		if(!(saveDirectory.isDirectory() || saveDirectory.mkdir())){
			json.put(MSG, MSG_ERROR);
			return json;
		}
		
		BufferedReader reader = null;
		try {
			File file = new File(saveDirectory, fileName);
			reader = new BufferedReader(new FileReader(file));
			List<String[]> datalist = new ArrayList();
			int colnum = -1;
			int rownum = 0;
			CsvReader csvReader = new CsvReader(reader);
			while(csvReader.readRecord()){
				colnum = (colnum < csvReader.getColumnCount())? csvReader.getColumnCount() : colnum;
				datalist.add(csvReader.getValues());
				rownum++;
			}
			json.put(DATA, datalist);
			json.put(COLNUM, colnum);
			json.put(ROWNUM, rownum);
			json.put(MSG, MSG_SUCCESS);
			session.setAttribute(ExploreController.CURFILEURL, file.getPath()); //设置SESSION
		} catch (FileNotFoundException e) {
			json.put(MSG, "文件不存在");
		} catch (IOException e) {
			json.put(MSG, "IO错误");
		} finally{
			if(reader != null){
				try {
					reader.close();
				} catch (IOException e) {
					json.put(MSG, "IO错误");
				}
			}
		}
		return json;
	}
	
	@RequestMapping(value = "upload", method = RequestMethod.POST)
	public @ResponseBody JSONObject upload(@RequestParam("uploadfile") CommonsMultipartFile file, 
			HttpServletRequest request) throws Exception{
		HttpSession session = request.getSession();
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
	    	List<DataSources> dbs = service.findAll();
			JSONArray array = new JSONArray();
			array.addAll(dbs);
			json.put(DATA, array);
			json.put(MSG, MSG_SUCCESS);
		}else{
			json.put(MSG, MSG_ERROR);
		}
		
		return json;
	}

}
