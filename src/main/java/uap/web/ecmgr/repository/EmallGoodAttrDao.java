package uap.web.ecmgr.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import uap.web.ecmgr.entity.EmallGoodsAttr;

public interface EmallGoodAttrDao extends PagingAndSortingRepository<EmallGoodsAttr,Long>{
	
	EmallGoodsAttr findById(long id);

}
