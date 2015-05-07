package uap.web.ecmgr.web.emall.good;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.persistence.SearchFilter.Operator;

import uap.web.ecmgr.entity.EmallGood;
import uap.web.ecmgr.service.emall.EmallGoodsService;

@Controller
@RequestMapping(value = "/emall/goods")
public class EmallGoodsController {

	@Autowired
	private EmallGoodsService goodsService;

	/** 分页 */
	@RequestMapping(value = "page", method = RequestMethod.GET)
	public @ResponseBody Page<EmallGood> page(
			@RequestParam(value = "page", defaultValue = "1") int pageNumber,
			@RequestParam(value = "page.size", defaultValue = "10") int pageSize,
			@RequestParam(value = "sortType", defaultValue = "auto") String sortType,
			Model model, ServletRequest request) {
		// 待完善查询条件
		Map<String, Object> searchParams = new HashMap<String, Object>();
		String queryCon = request.getParameter("searchText");
		searchParams.put(Operator.LIKE + "_title", queryCon);
		PageRequest pageRequest = buildPageRequest(pageNumber, pageSize,
				sortType);
		Page<EmallGood> goodsPage = goodsService.getGoodsPage(searchParams,
				pageRequest);
		return goodsPage;
	}

	/** 进入新增 */
	@RequestMapping(value = "create", method = RequestMethod.GET)
	public @ResponseBody EmallGood addCategory() {
		EmallGood good = new EmallGood();
		return good;
	}

	/** 保存新增 */
	@RequestMapping(value = "create", method = RequestMethod.POST)
	public @ResponseBody EmallGood create(@RequestBody EmallGood good,
			HttpServletRequest resq) {
		try {
			good = goodsService.saveGood(good);
		} catch (Exception e) {
			// 待记录日志
			e.printStackTrace();
		}
		return good;
	}

	/**
	 * 进入更新界面
	 * 
	 * @param id
	 * @param model
	 * @return 需要更新的实体的json结构
	 */
	@RequestMapping(value = "update/{id}", method = RequestMethod.GET)
	public @ResponseBody EmallGood updateForm(@PathVariable("id") Long id,
			Model model) {
		EmallGood good = goodsService.getGoodInfo(id);
		return good;
	}

	/** 保存更新 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public @ResponseBody EmallGood update(@RequestBody EmallGood good) {
		try {
			good = goodsService.saveGood(good);
		} catch (Exception e) {
			// 待记录日志
			e.printStackTrace();
		}
		return good;
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
		goodsService.deleteById(id);
		return true;
	}

	/**
	 * 创建分页请求.
	 */
	private PageRequest buildPageRequest(int pageNumber, int pagzSize,
			String sortType) {
		Sort sort = null;
		if ("auto".equals(sortType)) {
			sort = new Sort(Direction.DESC, "id");
		} else if ("title".equals(sortType)) {
			sort = new Sort(Direction.ASC, "title");
		}
		return new PageRequest(pageNumber - 1, pagzSize, sort);
	}
}
