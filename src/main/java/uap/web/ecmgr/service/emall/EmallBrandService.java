package uap.web.ecmgr.service.emall;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.Polymorphism;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.persistence.DynamicSpecifications;
import org.springside.modules.persistence.SearchFilter;

import uap.web.ecmgr.entity.EmallBrand;
import uap.web.ecmgr.entity.EmallCategory;
import uap.web.ecmgr.repository.EmallBrandDao;

@Service
public class EmallBrandService {
	@Autowired
	private EmallBrandDao BrandDao;
	
	public EmallBrand getbrandinfo(Long id){
		return BrandDao.findById(id);
	}
	public List<EmallBrand> getBrankByName(String brandName){
		return BrandDao.findByName(brandName);
	}
	public List<EmallBrand> getByBrandPinyin(String brandPinyin){
		return BrandDao.findByBrandPinyin(brandPinyin);
	}
	public EmallBrand getByLogo(String brandLogo){
		return BrandDao.findByLogo(brandLogo);
	}
	public List<EmallBrand> getBySort(BigDecimal sort){
		return BrandDao.findBySort(sort);
	}
	public List<EmallBrand> getByLink(String link){
		return BrandDao.findByLink(link);
	}
	public List<EmallBrand> getIsLocal(BigDecimal isLocal){
		return BrandDao.findIsLocal(isLocal);
	}
	public List<EmallBrand> getByErpBrandId(String erpBrandId){
		return BrandDao.findByErpBrandId(erpBrandId);
	}
	public List<EmallBrand> getByGmtCreate(Timestamp gmtCreate){
		return BrandDao.fingByGmtCreate(gmtCreate);
	}
	public Page<EmallBrand> getBrnadPage(Map<String, Object> searchParams, PageRequest pageRequest) {
		Specification<EmallBrand> spec = buildSpecification(searchParams);
		return BrandDao.findAll(spec, pageRequest);
	}
	private Specification<EmallBrand> buildSpecification(Map<String, Object> searchParams) {
		Map<String, SearchFilter> filters = SearchFilter.parse(searchParams);
		Specification<EmallBrand> spec = DynamicSpecifications.bySearchFilter(filters.values(), EmallBrand.class);
		return spec;
	}
//	public Page<EmallBrand> getCategoryPage(Map<String, Object> searchParams, PageRequest pageRequest) {
//		Specification<EmallBrand> spec = buildSpecification(searchParams);
//		return BrandDao.findAll(spec, pageRequest);
//	}
	@Transactional
	public EmallBrand saveBrand(EmallBrand brand) throws Exception{
		if(0 == brand.getId()){
			brand.setId(BrandDao.getNextId());
		}
		Date d =new Date();
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time=sdf.format(d);
		Format f=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date d1=(Date)f.parseObject(time);
		Timestamp ts=new Timestamp(d1.getTime());
		
		brand.setGmtModify(ts);
		BigDecimal b=new BigDecimal(1);
		brand.setStatus(b);
		brand.setGmtCreate(ts);
		return BrandDao.save(brand);
	}
	public EmallBrand getBrandInfo(Long id) {
		return BrandDao.findOne(id);
	}
	public void deleteById(Long id) {
		BrandDao.delete(id);
	}
}
