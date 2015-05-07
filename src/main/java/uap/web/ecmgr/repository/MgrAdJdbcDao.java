package uap.web.ecmgr.repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.annotation.QueryAnnotation;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Component;

import uap.web.core.jdbc.BaseJdbcDao;
import uap.web.ecmgr.entity.MgrAd;

@Component
public class MgrAdJdbcDao extends  BaseJdbcDao<MgrAd> {
	
	public MgrAd findById(long Id) {
		String sql = "select * from emall_ad_info where id = ?";
		MgrAd result = (MgrAd) this.getJdbcTemplate().query(sql, new Object[] { Id }, BeanPropertyRowMapper.newInstance(MgrAd.class));
		return result;
	}
	
	
	public long getNextId() {
		String sql = "select max(id)+1 from emall_ad_info";
		return this.getJdbcTemplate().queryForObject(sql, Long.class);
	}
	
	public List<MgrAd> findByType(BigDecimal type) {
		String sql = "select * from emall_ad_info where type = ?";
		List<MgrAd> result = (List<MgrAd>) this.getJdbcTemplate().query(sql, new Object[] { type }, BeanPropertyRowMapper.newInstance(MgrAd.class));
		return result;
	}
	
	public List<MgrAd> find10ByType(BigDecimal type) {
		String sql = "select top 10 * from emall_ad_info where type = ? and isactive='Y' limit 10";
		List<MgrAd> result = (List<MgrAd>) this.getJdbcTemplate().query(sql, new Object[] { type }, BeanPropertyRowMapper.newInstance(MgrAd.class));
		return result;
	}
	
	public List<MgrAd> findByTitle(String title) {
		String sql = "select * from emall_ad_info where title = ?";
		List<MgrAd> result = (List<MgrAd>) this.getJdbcTemplate().query(sql, new Object[] { title }, BeanPropertyRowMapper.newInstance(MgrAd.class));
		return result;
	}
	

	public List<MgrAd> findBySort(BigDecimal sort) {
		String sql = "select * from emall_ad_info where sort = ?";
		List<MgrAd> result = (List<MgrAd>) this.getJdbcTemplate().query(sql, new Object[] { sort }, BeanPropertyRowMapper.newInstance(MgrAd.class));
		return result;
	}
	
	public List<MgrAd> findByName(String name) {
		String sql = "select * from emall_ad_info where name = ?";
		List<MgrAd> result = (List<MgrAd>) this.getJdbcTemplate().query(sql, new Object[] { name }, BeanPropertyRowMapper.newInstance(MgrAd.class));
		return result;
	}
	

	public List<MgrAd> findByIsActive(String isActive) {
		String sql = "select * from emall_ad_info where isactive = ?";
		List<MgrAd> result = (List<MgrAd>) this.getJdbcTemplate().query(sql, new Object[] { isActive }, BeanPropertyRowMapper.newInstance(MgrAd.class));
		return result;
	}
	
	public List<MgrAd> findByCreateTime(Timestamp create_date) {
		String sql = "select * from emall_ad_info where create_date = ?";
		List<MgrAd> result = (List<MgrAd>) this.getJdbcTemplate().query(sql, new Object[] { create_date }, BeanPropertyRowMapper.newInstance(MgrAd.class));
		return result;
	}
	

	
}
