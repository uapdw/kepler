package uap.web.ecmgr.rest.emall;

import java.util.List;

import javax.validation.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springside.modules.web.MediaTypes;

import uap.web.ecmgr.entity.EmallCategory;
import uap.web.ecmgr.rest.RestException;
import uap.web.ecmgr.service.emall.EmallCategoryService;

@RestController
@RequestMapping(value = "/api/v1/category")
public class CategoryRestController {
	private static Logger logger = LoggerFactory.getLogger(CategoryRestController.class);

	@Autowired
	private EmallCategoryService categoryService;

	@Autowired
	private Validator validator;

	@RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallCategory> list() {
		return categoryService.getCateGorysByParent("-1");
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public EmallCategory get(@PathVariable("id") Long id) {
		EmallCategory cat = categoryService.getCategoryInfo(10000L);
		if (cat == null) {
			String message = "任务不存在(id:" + id + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return cat;
	}
}
