package uap.web.ecmgr.rest.emall;

import java.util.List;

import javax.validation.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springside.modules.web.MediaTypes;

import uap.web.ecmgr.entity.EmallAttribute;
import uap.web.ecmgr.rest.RestException;
import uap.web.ecmgr.service.emall.EmallAttributeService;

@RestController
@RequestMapping(value="/api/v1/attribute")
public class AttributeRestController {
	public static Logger logger =LoggerFactory.getLogger(AttributeRestController.class);
	
	@Autowired
	private EmallAttributeService attrService;
	
	@Autowired
	private Validator validator;
	
	@RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<EmallAttribute> list() throws Exception {
		return attrService.findByAttrCode("12");
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public EmallAttribute get(@PathVariable("id") Long id){
		EmallAttribute attr = attrService.getAttributeInfo(id);
		
		if(attr == null) {
			String message = "任务不存在(id:" + id + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return attr;	
	}
	
	@RequestMapping(value="/name",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public List<EmallAttribute> getByAttrName(@RequestParam("attrName") String attrName) {
		List<EmallAttribute> attrs= attrService.findByAttrName(attrName);
		
		if(attrs == null) {
			String message = "任务不存在(attrName:" + attrName + ")";
			logger.warn(message);
			throw new RestException(HttpStatus.NOT_FOUND, message);
		}
		return attrs;
	}

	

}
