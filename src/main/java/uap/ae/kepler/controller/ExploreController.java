package uap.ae.kepler.controller;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.rosuda.REngine.REXP;
import org.rosuda.REngine.REngine;
import org.rosuda.REngine.RList;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 数据源--Controller
 * 
 * @author huoqi
 *
 */
@Controller
@RequestMapping(value = "ae/explore")
public class ExploreController {
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

	public void CSVWriter(File file, SolrDocumentList docList) throws Exception {
		BufferedWriter bw = new BufferedWriter(new FileWriter(file, true)); // 附加
		SimpleDateFormat foo = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String dateinfo, other_articles_sitename, other_articles_title;
		Date other_articles_publishtime;
		bw.write("标题,网站名称,发布时间");
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
			bw.write(other_articles_title + "," + other_articles_sitename + ","
					+ dateinfo);
			bw.newLine();
		}

		bw.close();

	}

	@RequestMapping(value = "savetocsv", method = RequestMethod.GET)
	public @ResponseBody String savetocsv(HttpServletRequest request)
			throws Exception {
		try {
			SolrClient solrclient = new HttpSolrClient(
					"http://172.20.8.123:8983/solr/other_articles_shard1_replica1");
			String query = request.getParameter("data");
			SolrDocumentList docList = searchDataInSolr(solrclient, query);
			if (docList.getNumFound() == 0) {
				return "没有查找到结果数据";
			}
			String sessionId = request.getRequestedSessionId();
			SimpleDateFormat foo = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			String dateinfo = foo.format(new Date());
			dateinfo = dateinfo.substring(0, dateinfo.indexOf(" "));
			File csv = new File("csv/" + sessionId + "_" + dateinfo + ".csv"); // CSV数据文件
			if (csv.exists()) {
				csv.delete();
				csv = new File("csv/" + sessionId + "_" + dateinfo + ".csv");
			}
			System.out.println(csv.getAbsolutePath());
			CSVWriter(csv, docList);
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
		String sessionId = request.getRequestedSessionId();
		SimpleDateFormat foo = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String dateinfo = foo.format(new Date());
		dateinfo = dateinfo.substring(0, dateinfo.indexOf(" "));
		File csv = new File("csv/" + sessionId + "_" + dateinfo + ".csv");

		return csv.getAbsolutePath().replace("\\", "/");
	}

	private String getStatPath(HttpServletRequest request) {
		String sessionId = request.getRequestedSessionId();
		SimpleDateFormat foo = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String dateinfo = foo.format(new Date());
		dateinfo = dateinfo.substring(0, dateinfo.indexOf(" "));
		File csv = new File("csv/" + sessionId + "_" + dateinfo + "_stat.csv");

		return csv.getAbsolutePath().replace("\\", "/");
	}

	private String getStatRScript(String filePath, String statPath,
			String index, String maxNumber) {
		StringBuffer script = new StringBuffer();
		script.append("data <- read.csv(\"" + filePath + "\",fileEncoding = \"UTF-8\");");
		script.append("field <- \"" + index +"\";");
		String field = "";
		if(index.equals("标题")){
			field = "data[,1]";
		}
		if(index.equals("网站名称")){
			field = "data[,2]";
		}
		if(index.equals("发布时间")){
			field = "data[,3]";
		}
		script.append("result <- aggregate(" + field + ",by=list(" + field
				+ "),length);");
		script.append("colnames(result) <- c(field,\"数量\");");
		script.append("result <- result[order(result$数量,decreasing = TRUE),];");
		
		if (!maxNumber.equals("不限定")) {
			script.append("maxnumber <- "+ maxNumber+ ";");
			script.append("if(length(result[,1]) < " + maxNumber
					+ "){maxnumber <- length(result[,1]);};");
			script.append("result <- result[1:maxnumber,];");
		}
		script.append("write.csv(result,\"" + statPath + "\");");
		script.append("result;");

		return script.toString();
	}

	private static final String MSG_SUCCESS = "success";
	private static final String DATA = "data";
	private static final String COLNUM = "colnum";
	private static final String ROWNUM = "rownum";
	private static final String MSG = "msg";

	@RequestMapping(value = "stat", method = RequestMethod.GET)
	public  @ResponseBody JSONObject stat(
			@RequestParam(value = "field", defaultValue = "1") String field,
			@RequestParam(value = "maxNumber", defaultValue = "100") String maxNumber,
			HttpServletRequest request) throws NoSuchMethodException {

		String csvPath = getCurrentCSVPath(request);
		String statPath = getStatPath(request);
		REngine lastEngine = REngine.getLastEngine();
		JSONObject jsonObject = new JSONObject();
		try {
			REXP repResult = lastEngine.parseAndEval(getStatRScript(csvPath, statPath, field,
					maxNumber));
			
			int colnum = -1;
			int rownum = 0;
			RList asList = repResult.asList();
			String[] keys = asList.keys();
			colnum = keys.length;
			List<String[]> datalist = new ArrayList<String[]>();
			datalist.add(new String[]{keys[0],keys[1]});
			String[] targetStr = asList.at(0).asStrings();
			String[] numberStr = asList.at(1).asStrings();
			rownum = targetStr.length;
			for(int i=0;i<rownum;i++){
				String[] rowData = new String[]{targetStr[i],numberStr[i]};
				datalist.add(rowData);
			}
			
			jsonObject.put(DATA, datalist);
			jsonObject.put(COLNUM, colnum);
			jsonObject.put(ROWNUM, rownum);
			jsonObject.put(MSG, MSG_SUCCESS);
			
		} catch (Exception e1) {
			e1.printStackTrace();
		}

		return jsonObject;
	}
}
