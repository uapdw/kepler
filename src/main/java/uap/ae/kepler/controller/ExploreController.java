package uap.ae.kepler.controller;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.cloud.ClusterState;
import org.apache.solr.common.cloud.ZkStateReader;
import org.rosuda.REngine.REXP;
import org.rosuda.REngine.REXPMismatchException;
import org.rosuda.REngine.REngine;
import org.rosuda.REngine.RList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import sun.misc.BASE64Decoder;
import uap.ae.kepler.entity.DataSources;
import uap.ae.kepler.entity.MailInfo;
import uap.ae.kepler.service.MailService;
import uap.ae.kepler.solr.SolrService;

/**
 * 数据源--Controller
 * 
 * @author huoqi
 *
 */
@Controller
@RequestMapping(value = "ae/explore")
public class ExploreController {
	@Autowired
	private SolrService solrService;

	final String defaultCollection = "other_articles";
	final int zkClientTimeout = 20000;
	final int zkConnectTimeout = 1000;

	@Autowired
	private MailService mailService;

	/**
	 * 此路径需与上传路径保持一致
	 */
	private static final String savedImagesfolder = "savedImages";
//	private static final String uploadFolderName = "uploads";
	public static final String CURFILEURL = "curFileUrl";
	public static final String CURANAURL = "anaFileUrl";
	private static final String MSG_SUCCESS = "success";
	private static final String DATA = "data";
	private static final String COLNUM = "colnum";
	private static final String ROWNUM = "rownum";
	private static final String MSG = "msg";
	private static final String MSG_ERROR = "error";
	private static String SolrHost = "";

	public static final String SHARE_PIC_ID = "share_pic_id";
	
	/**
	 * 设置CloudSolrClient
	 * 
	 * @return CloudSolrClient
	 */
	public CloudSolrClient setCloudSolrClient() {
		CloudSolrClient cloudsolrclient = solrService.getCloudSolrClient();
		cloudsolrclient.setDefaultCollection(defaultCollection);
		cloudsolrclient.setZkClientTimeout(zkClientTimeout);
		cloudsolrclient.setZkConnectTimeout(zkConnectTimeout);
		return cloudsolrclient;
	}

	@RequestMapping(value = "sendmail", method = RequestMethod.POST)
	public @ResponseBody JSONObject sendmail(@RequestBody MailInfo mailInfo,
			HttpServletRequest request) throws Exception {
		JSONObject o = new JSONObject();
		if (ArrayUtils.isEmpty(mailInfo.getToList())) {
			o.put(MSG, MSG_ERROR);
			return o;
		}
		if(Pattern.matches("/^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$/", mailInfo.getToList()[0])){
			o.put(MSG, MSG_ERROR);
			return o;
		}
		HttpSession session = request.getSession();
		String curProjectPath = session.getServletContext().getRealPath("/");
		mailInfo.setFileUrl(curProjectPath + "/" + mailInfo.getFileUrl());
		if (mailService.sendNotificationMail(mailInfo)) {
			o.put(MSG, MSG_SUCCESS);
		} else {
			o.put(MSG, MSG_ERROR);
		}
		return o;
	}
	
	@RequestMapping(value = "getid", method = RequestMethod.GET)
	public @ResponseBody JSONObject getid(HttpServletRequest request) {
		HttpSession session = request.getSession();
		UUID uuid = UUID.randomUUID();
		String fileId=uuid.toString();
		session.setAttribute(SHARE_PIC_ID, savedImagesfolder + "/" + fileId + ".png");
		JSONObject o = new JSONObject();
		o.put(DATA, savedImagesfolder + "/" + fileId + ".png");
		o.put(MSG, MSG_SUCCESS);
		return o;
	}

	/**
	 * 查询索引
	 * 
	 * @param solrclient
	 * @param _query
	 * @return SolrDocumentList
	 * @throws Exception
	 */

	public SolrDocumentList searchDataInSolr(SolrClient solrclient,
			String _query) throws Exception {

		// 构建一个Solr查询
		SolrQuery query = new SolrQuery();

		// 查询关键词，*:*代表所有属性、所有值，即所有index
		query.set("q", _query);

		// 分页，start=0就是从0开始，，rows=5当前返回5条记录，第二页就是变化start这个值为5就可以了。
		query.set("rows", 1000);

		query.set("sort", "other_articles_publishtime desc");

		QueryResponse queryResponse = solrclient.query(query);
		// 返回结果
		SolrDocumentList docList = queryResponse.getResults();

		return docList;
	}

	/**
	 * 写CSV文件
	 * 
	 * @param file
	 * @param docList
	 * @throws Exception
	 */

	public void CSVWriter(File file, SolrDocumentList docList) throws Exception {
		// BufferedWriter bw = new BufferedWriter(new FileWriter(file, true));

		OutputStreamWriter write = new OutputStreamWriter(new FileOutputStream(
				file), "UTF-8");
		BufferedWriter bw = new BufferedWriter(write);

		SimpleDateFormat foo = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String dateinfo, other_articles_sitename, other_articles_title;
		Date other_articles_publishtime;
		bw.write("\"标题\",\"网站名称\",\"发布时间\"");
		bw.newLine();
		for (SolrDocument solrdoc : docList) {
			other_articles_publishtime = (Date) solrdoc
					.getFieldValue("other_articles_publishtime");
			dateinfo = foo.format(other_articles_publishtime);
			other_articles_sitename = solrdoc.getFieldValue(
					"other_articles_sitename").toString();
			other_articles_title = solrdoc
					.getFieldValue("other_articles_title").toString();

			// 添加新的数据行
			bw.write("\""+other_articles_title + "\",\"" + other_articles_sitename + "\",\""
					+ dateinfo+"\"");
			bw.newLine();
		}

		bw.close();

	}

	/**
	 * 向界面传递solr索引位置
	 * 
	 * @param request
	 * @return String
	 * @throws Exception
	 */

	@RequestMapping(value = "gethostinfo", method = RequestMethod.GET)
	public @ResponseBody String gethostinfo(HttpServletRequest request)
			throws Exception {
		CloudSolrClient cloudsolrclient = setCloudSolrClient();
		cloudsolrclient.connect();
		System.out.println("The cloud Server has been connected !!!!");
		ZkStateReader zkStateReader = cloudsolrclient.getZkStateReader();
		ClusterState clusterState = zkStateReader.getClusterState();
		String clusterInfo = clusterState.getCollection(defaultCollection)
				.getProperties().get("shards").toString();
		String hostInfo = clusterInfo.substring(
				clusterInfo.indexOf("base_url") + 9,
				clusterInfo.lastIndexOf("solr") + 4);
		SolrHost = hostInfo;
		return hostInfo;
	}

	/**
	 * 将所有搜索结果保存为csv文件
	 * 
	 * @param request
	 * @return String
	 * @throws Exception
	 */
	@RequestMapping(value = "savetocsv", method = RequestMethod.GET)
	public @ResponseBody String savetocsv(HttpServletRequest request)
			throws Exception {
		try {
			SolrClient solrclient = new HttpSolrClient(SolrHost + "/"
					+ defaultCollection + "_shard1_replica1");
			String query = request.getParameter("data");
			query = new String(query.getBytes("ISO-8859-1"), "UTF-8");
			SolrDocumentList docList = searchDataInSolr(solrclient, query);
			if (docList.getNumFound() == 0) {
				return "没有找到结果数据";
			}
			String sessionId = request.getRequestedSessionId();
			SimpleDateFormat foo = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			String dateinfo = foo.format(new Date());
			dateinfo = dateinfo.substring(0, dateinfo.indexOf(" "));
			HttpSession session = request.getSession();
			String curProjectPath = session.getServletContext()
					.getRealPath("/");
			String saveDirectoryPath = curProjectPath + "/uploads/" + sessionId
					+ "_" + dateinfo + ".csv";
			File csv = new File(saveDirectoryPath); // CSV数据文件
			if (csv.exists()) {
				csv.delete();
				csv = new File(saveDirectoryPath);
			}
			System.out.println(csv.getAbsolutePath());
			CSVWriter(csv, docList);
			session.setAttribute(CURFILEURL, csv.getPath());
		} catch (FileNotFoundException e) {
			// File对象的创建过程中的异常捕获
			e.printStackTrace();
			return "找不到系统路径！";
		} catch (IOException e) {
			// BufferedWriter在关闭对象捕捉异常
			e.printStackTrace();
			return "保存CSV文件失败！";
		} catch (Exception e) {
			// BufferedWriter在关闭对象捕捉异常
			e.printStackTrace();
			return "获取数据异常！";
		}

		return "结果已保存为CSV文件！";
	}

	private String getCurrentCSVPath(HttpServletRequest request) {
		HttpSession session = request.getSession();
		Object dataPath = session.getAttribute(CURFILEURL);
		if (dataPath == null) {
			System.out.println("得不到当前数据文件，Session中不存在");
			return null;
		}

		return dataPath.toString().replace("\\", "/");
	}

	private String getStatPath(HttpServletRequest request, String stat) {
		String sessionId = request.getRequestedSessionId();
		SimpleDateFormat foo = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String dateinfo = foo.format(new Date());
		dateinfo = dateinfo.substring(0, dateinfo.indexOf(" "));
		HttpSession session = request.getSession();
		String curProjectPath = session.getServletContext().getRealPath("/");
		String saveDirectoryPath = curProjectPath + "/uploads/" + sessionId
				+ "_" + dateinfo + "_" + stat + ".csv";
		File csv = new File(saveDirectoryPath);

		return csv.getAbsolutePath().replace("\\", "/");
	}

	private String getStatRScript(String filePath, String statPath,
			String index, String maxNumber) {
		StringBuffer script = new StringBuffer();
		script.append("data <- read.csv(\"" + filePath
				+ "\",fileEncoding = \"UTF-8\");");
		script.append("field <- \"" + index + "\";");
		String field = "";
		if (index.equals("标题")) {
			field = "data[,1]";
		}
		if (index.equals("网站名称")) {
			field = "data[,2]";
		}
		if (index.equals("发布时间")) {
			field = "data[,3]";
		}
		script.append("result <- aggregate(" + field + ",by=list(" + field
				+ "),length);");
		script.append("colnames(result) <- c(field,\"数量\");");
		script.append("result <- result[order(result$数量,decreasing = TRUE),];");

		if (!maxNumber.equals("不限定")) {
			script.append("maxnumber <- " + maxNumber + ";");
			script.append("if(length(result[,1]) < " + maxNumber
					+ "){maxnumber <- length(result[,1]);};");
			script.append("result <- result[1:maxnumber,];");
		}
		script.append("write.csv(result,\"" + statPath + "\");");
		script.append("result;");
		
		String result = script.toString();
		System.out.println(result);
		return result;
	}

	private JSONObject toJson(REXP repResult) {
		int colnum = -1;
		int rownum = 0;
		RList asList;
		JSONObject jsonObject = new JSONObject();
		try {
			asList = repResult.asList();
			String[] keys = asList.keys();
			colnum = keys.length;
			List<String[]> datalist = new ArrayList<String[]>();
			datalist.add(new String[] { keys[0], keys[1] });
			String[] targetStr = asList.at(0).asStrings();
			String[] numberStr = asList.at(1).asStrings();
			rownum = targetStr.length;
			for (int i = 0; i < rownum; i++) {
				String[] rowData = new String[] { targetStr[i], numberStr[i] };
				datalist.add(rowData);
			}

			jsonObject.put(DATA, datalist);
			jsonObject.put(COLNUM, colnum);
			jsonObject.put(ROWNUM, rownum);
			jsonObject.put(MSG, MSG_SUCCESS);
		} catch (REXPMismatchException e) {
			e.printStackTrace();
			jsonObject.put(MSG, e.getMessage());
		}

		return jsonObject;
	}

	@RequestMapping(value = "stat", method = RequestMethod.GET)
	public @ResponseBody JSONObject stat(
			@RequestParam(value = "field", defaultValue = "1") String field,
			@RequestParam(value = "maxNumber", defaultValue = "100") String maxNumber,
			HttpServletRequest request) throws NoSuchMethodException {
		System.out.println("stat start~~~~~~~~~~~~");
		
		
		try {
			field = new String(field.getBytes("ISO-8859-1"), "UTF-8");
			maxNumber = new String(maxNumber.getBytes("ISO-8859-1"), "UTF-8");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		
		String csvPath = getCurrentCSVPath(request);
		String statPath = getStatPath(request, "stat");
		REngine lastEngine = REngine.getLastEngine();
		REXP repResult;
		try {
			String statRScript = getStatRScript(csvPath,
					statPath, field, maxNumber);
			System.out.println(statRScript);
			repResult = lastEngine.parseAndEval(statRScript);
			lastEngine.parseAndEval("rm(list = ls());");
		} catch (Exception e) {
			System.out.println(e);
			JSONObject jsonObject = new JSONObject();
			jsonObject.put(MSG, e.getMessage());
			return jsonObject;
		}

		System.out.println("stat sucess~~~~~~~~~~~~");
		HttpSession session = request.getSession();
		session.setAttribute(CURANAURL, statPath);
		return toJson(repResult);

	}

	private String getWordRScript(String filePath, String statPath,
			String index, String maxNumber) {
		StringBuffer script = new StringBuffer();
		script.append("data <- read.csv(\"" + filePath
				+ "\",fileEncoding = \"UTF-8\");");
		script.append("field <- \"" + index + "\";");
		String field = "";
		if (index.equals("标题")) {
			field = "data[,1]";
		}
		if (index.equals("网站名称")) {
			field = "data[,2]";
		}
		if (index.equals("发布时间")) {
			field = "data[,3]";
		}
		script.append("t <- " + field + ";");
		script.append("library(tm);library(rmmseg4j);");
		script.append("temp <- paste(t,collapse=\" \");");
		script.append("txt <- Corpus(VectorSource(temp));"
				+ "txt <- tm_map(txt,removeNumbers);"
				+ "txt <- tm_map(txt,stripWhitespace);"
				+ "txt <- tm_map(txt,removePunctuation);"
				+ "txt <- tm_map(txt,removeWords,stopwords(\"english\"));"
				+ "txt <- tm_map(txt,PlainTextDocument);"
				+ "t1 <- inspect(txt[1]);"
				+ "t <- mmseg4j(as.character(t1)); t <- strsplit(t,split  = \" \")[[1]];" + "t <- t[nchar(t) >=2];"
				+ "result <- aggregate(t,by=list(t),length);"
				+ "result <- result[order(result$x,decreasing = TRUE),];"
				+ "colnames(result) <- c(\"词语\",\"词频\");"
		);

		if (!maxNumber.equals("不限定")) {
			script.append("maxnumber <- " + maxNumber + ";");
			script.append("if(length(result[,1]) < " + maxNumber
					+ "){maxnumber <- length(result[,1]);};");
			script.append("result <- result[1:maxnumber,];");
		}
		script.append("write.csv(result,\"" + statPath + "\");");
		script.append("result;");
		
		String result = script.toString();
		System.out.println(result);
		return result;
	}

	@RequestMapping(value = "wordStat", method = RequestMethod.GET)
	public @ResponseBody JSONObject wordStat(
			@RequestParam(value = "field", defaultValue = "1") String field,
			@RequestParam(value = "maxNumber", defaultValue = "100") String maxNumber,
			HttpServletRequest request) throws NoSuchMethodException {
		System.out.println("stat start~~~~~~~~~~~~");
		try {
			field = new String(field.getBytes("ISO-8859-1"), "UTF-8");
			maxNumber = new String(maxNumber.getBytes("ISO-8859-1"), "UTF-8");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}

		String csvPath = getCurrentCSVPath(request);
		String statPath = getStatPath(request, "word");
		REngine lastEngine = REngine.getLastEngine();
		REXP repResult;
		try {
			repResult = lastEngine.parseAndEval(getWordRScript(csvPath,
					statPath, field, maxNumber));
			lastEngine.parseAndEval("rm(list = ls());");
		} catch (Exception e) {
			e.printStackTrace();
			JSONObject jsonObject = new JSONObject();
			jsonObject.put(MSG, e.getMessage());
			return jsonObject;
		}

		System.out.println("wordstat sucess~~~~~~~~~~~~");
		HttpSession session = request.getSession();
		session.setAttribute(CURANAURL, statPath);

		return toJson(repResult);

	}

	@RequestMapping(value = "cluster", method = RequestMethod.GET)
	public @ResponseBody JSONObject cluster(
			@RequestParam(value = "field", defaultValue = "1") String field,
			@RequestParam(value = "maxNumber", defaultValue = "100") String maxNumber,
			HttpServletRequest request) throws NoSuchMethodException {
		System.out.println("cluster start~~~~~~~~~~~~");
		
		try {
			field = new String(field.getBytes("ISO-8859-1"), "UTF-8");
			maxNumber = new String(maxNumber.getBytes("ISO-8859-1"), "UTF-8");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		
		String csvPath = getCurrentCSVPath(request);
		String statPath = getStatPath(request, "cluster");
		REngine lastEngine = REngine.getLastEngine();
		REXP repResult;
		try {
			repResult = lastEngine.parseAndEval(getClusterScript(csvPath,
					statPath, field, maxNumber));
			
		} catch (Exception e) {
			e.printStackTrace();
			JSONObject jsonObject = new JSONObject();
			jsonObject.put(MSG, e.getMessage());
			return jsonObject;
		}
		System.out.println("cluster sucess~~~~~~~~~~~~");

		HttpSession session = request.getSession();
		session.setAttribute(CURANAURL, statPath);

		return toJson(repResult);

	}

	@RequestMapping(value = "metadata", method = RequestMethod.GET)
	public @ResponseBody JSONObject getMetaData(HttpServletRequest request)
			throws NoSuchMethodException {
		System.out.println("meta start~~~~~~~~~~~~");
		JSONObject jsonObject = new JSONObject();

		HttpSession session = request.getSession();
		Object dataPath = session.getAttribute(CURFILEURL);
		if (dataPath == null) {
			System.out.println("目标数据文件不存在！");
			jsonObject.put(MSG, "目标数据文件不存在！");
			return jsonObject;
		}
		System.out.println(dataPath.toString());

		REngine lastEngine = REngine.getLastEngine();
		REXP repResult;
		try {
			System.out.println("获取元数据信息");
			String metaString = "data <- read.csv(\""
					+ dataPath.toString().replace("\\", "/")
					+ "\",fileEncoding = \"UTF-8\");"
					+ "result.names <- colnames(data);result.names;";
			System.out.println(metaString);
			repResult = lastEngine.parseAndEval(metaString);
			lastEngine.parseAndEval("rm(list = ls());");
			String[] colNames = repResult.asStrings();
			System.out.println(colNames[0]);
			jsonObject.put(DATA, Arrays.asList(colNames));
			jsonObject.put(COLNUM, 1);
			jsonObject.put(ROWNUM, colNames.length);
			jsonObject.put(MSG, MSG_SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getStackTrace());
			jsonObject.put(MSG, e.getMessage());
			return jsonObject;
		}
		
		

		return jsonObject;
	}

	private String getClusterScript(String filePath, String statPath,
			String index, String maxNumber) {
		StringBuffer script = new StringBuffer();
		script.append("data <- read.csv(\"" + filePath
				+ "\",fileEncoding = \"UTF-8\");");
		script.append("field <- \"" + index + "\";");
		String field = "";
		if (index.equals("标题")) {
			field = "data[,1]";
		}
		if (index.equals("网站名称")) {
			field = "data[,2]";
		}
		if (index.equals("发布时间")) {
			field = "data[,3]";
		}
		script.append("t <- " + field + ";field <- t;");
		script.append("library(tm);library(rmmseg4j);t <- mmseg4j(as.character(t));");
		script.append("cluster.result <- data.frame(\""
				+ index
				+ "\"= field);"
				+ "seg <- Corpus(DataframeSource(data.frame(\"term\"=t)));"
				+ "term <- TermDocumentMatrix(seg, control = list(stopwords = TRUE));"
				+ "term <- t(as.matrix(term));"
				+ "model.kmeans <- kmeans(term, 7);"
				+ "cluster.result$类别 <- model.kmeans$cluster;"
				+ "result <- cluster.result;"
				+ "result <- result[order(result$类别),];");

		if (!maxNumber.equals("不限定")) {
			script.append("maxnumber <- " + maxNumber + ";");
			script.append("if(length(result[,1]) < " + maxNumber
					+ "){maxnumber <- length(result[,1]);};");
			script.append("result <- result[1:maxnumber,];");
		}
		script.append("write.csv(result,\"" + statPath + "\");");
		script.append("result;");

		String result = script.toString();
		System.out.println(result);
		return result;
	}

	/**
	 * 处理用于可视化的数据
	 * 
	 * @param request
	 * @return JSONObject
	 * @throws Exception
	 */
	@RequestMapping(value = "getViewedData", method = RequestMethod.GET)
	public @ResponseBody JSONArray getViewedData(HttpServletRequest request)
			throws Exception {
		//String statPath = getStatPath(request, "");
		HttpSession session = request.getSession();
		Object statPath = session.getAttribute(CURANAURL);
		if (statPath == null) {
			System.out.println("得不到当前数据文件，Session中不存在");
			return null;
		}
		String dataPath = statPath.toString().replace("\\", "/");
		String datatype = request.getParameter("data");
		datatype = new String(datatype.getBytes("ISO-8859-1"), "UTF-8");
		FileInputStream fileInputStream = new FileInputStream(dataPath);
		InputStreamReader inputStreamReader = new InputStreamReader(
				fileInputStream, "UTF-8");
		BufferedReader reader = new BufferedReader(inputStreamReader);
		String line = reader.readLine();
		System.out.println(datatype);
		if (datatype.equals("wordscloud")) {
			JSONObject jsonObject = new JSONObject();
			JSONArray jsonArray = new JSONArray();
			while ((line = reader.readLine()) != null) {
				String[] words = line.split("\",");
				String title = words[1].substring(words[1].indexOf("\"") + 1,
						words[1].length());
				title = new String(title.getBytes("ISO-8859-1"), "UTF-8");
				System.out.println("!!!!!!!!!!!"+title);
				int freq = Integer.parseInt(words[2]);
				jsonObject = new JSONObject();
				jsonObject.put("text", title);
				jsonObject.put("size", freq);
				jsonArray.add(jsonObject);
			}
			reader.close();
			return jsonArray;
		} else if (datatype.equals("pie")) {
			JSONObject jsonObject = new JSONObject();
			JSONArray jsonArray = new JSONArray();
			while ((line = reader.readLine()) != null) {
				String[] words = line.split("\",");
				String title = words[1].substring(words[1].indexOf("\"") + 1,
						words[1].length());
				title = new String(title.getBytes("ISO-8859-1"), "UTF-8");
				int freq = Integer.parseInt(words[2]);
				jsonObject = new JSONObject();
				jsonObject.put("value", freq);
				jsonObject.put("name", title);
				jsonArray.add(jsonObject);
			}
			reader.close();
			return jsonArray;
		} else {
			JSONObject jsonObject = new JSONObject();
			JSONArray jsonArray = new JSONArray();
			ArrayList<String> titleList = new ArrayList<String>();
			ArrayList<Integer> freqList = new ArrayList<Integer>();
			while ((line = reader.readLine()) != null) {
				String[] words = line.split("\",");
				String title = words[1].substring(words[1].indexOf("\"") + 1,
						words[1].length());
				title = new String(title.getBytes("ISO-8859-1"), "UTF-8");
				int freq = Integer.parseInt(words[2]);
				titleList.add(title);
				freqList.add(freq);
			}
			reader.close();
			jsonObject.put("title", titleList);
			jsonObject.put("freq", freqList);
			jsonArray.add(jsonObject);
			return jsonArray;

		}
	}
	
	@RequestMapping(value = "saveAsImage", method = RequestMethod.POST)
	public @ResponseBody String saveAsImage(HttpServletRequest request) throws Exception{
		String data = request.getParameter("data");
		HttpSession session = request.getSession();
		String curProjectPath = session.getServletContext().getRealPath("/");
//		String sessionId = request.getRequestedSessionId();
		String fileName = (String) session.getAttribute(SHARE_PIC_ID);
		if(StringUtils.isEmpty(fileName)){
			return "save image fail";
		}
		String saveImagesPath = curProjectPath + "/" + fileName;
	    try {
	        String[] url = data.split(",");
	        if(ArrayUtils.isEmpty(url)){
	        	return "save image fail";
	        }
	        String u = url[1];
	        // Base64解码
	        byte[] b = new BASE64Decoder().decodeBuffer(u);
	        // 生成图片		        
	        OutputStream out = new FileOutputStream(new File(saveImagesPath));
	        out.write(b);
	        out.flush();
	        out.close();
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return "save image ok";
	}
	
	/**
     * 将svg字符串转换为png
     * 
     * @param svgCode svg代码
     * @param pngFilePath 保存的路径
     * @throws TranscoderException svg代码异常
     * @throws IOException io错误
     */
    public static void convertToPng(String svgCode, String pngFilePath) throws IOException,
            TranscoderException {

        File file = new File(pngFilePath);

        FileOutputStream outputStream = null;
        try {
            file.createNewFile();
            outputStream = new FileOutputStream(file);
            convertToPng(svgCode, outputStream);
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
	
	 /**
     * 将svgCode转换成png文件，直接输出到流中
     * 
     * @param svgCode svg代码
     * @param outputStream 输出流
     * @throws TranscoderException 异常
     * @throws IOException io异常
     */
    public static void convertToPng(String svgCode, OutputStream outputStream)
            throws TranscoderException, IOException {
        try {
            byte[] bytes = svgCode.getBytes("utf-8");
            PNGTranscoder t = new PNGTranscoder();
            TranscoderInput input = new TranscoderInput(new ByteArrayInputStream(bytes));
            TranscoderOutput output = new TranscoderOutput(outputStream);
            t.transcode(input, output);
            outputStream.flush();
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    
	@RequestMapping(value = "saveAsImageD3", method = RequestMethod.POST)
	public @ResponseBody String saveAsImageD3(HttpServletRequest request) throws Exception{
		String svgdata = request.getParameter("data");
		HttpSession session = request.getSession();
		String curProjectPath = session.getServletContext().getRealPath("/");
//		String sessionId = request.getRequestedSessionId();
		String fileName = (String) session.getAttribute(SHARE_PIC_ID);
		if(StringUtils.isEmpty(fileName)){
			return "save image fail";
		}
		String saveImagesPath = curProjectPath + "/" + fileName;
		convertToPng(svgdata, saveImagesPath);
		return "save image ok";
	}

}
