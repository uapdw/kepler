package uap.web.ecmgr.repository;

import org.springframework.stereotype.Component;

import uap.web.core.jdbc.BaseJdbcDao;
import uap.web.ecmgr.entity.EmallGood;

@Component
public class EmallGoodsJdbcDao extends BaseJdbcDao<EmallGood> {
	
	public void saveEmallGood(EmallGood good){
		this.save(good);
	}
}
