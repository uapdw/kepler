package uap.ae.kepler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Component;

import uap.ae.kepler.entity.DataSources;
import uap.web.core.jdbc.BaseJdbcDao;

@Component
public class AeDataSourceDao extends BaseJdbcDao<DataSources> {

	public long getNextId() {
		String sql = "select ifnull(max(id) + 1, 1) from ae_datasources";
		return this.getJdbcTemplate().queryForObject(sql, Long.class);
	}

	public void addDataSource(DataSources dbs) {
		long id = getNextId();
		String sql = "insert into ae_datasources(id, filename, filetype, name) values ("
				+ id
				+ ", '"
				+ dbs.getFileName()
				+ "', '"
				+ dbs.getFileType()
				+ "', '"
				+ dbs.getName()
				+ "')";
		this.getJdbcTemplate().execute(sql);
	}

	public List<DataSources> findAll() {
		String sql = "select * from ae_datasources";
		List<DataSources> result = (List<DataSources>) this.getJdbcTemplate()
				.query(sql,
						BeanPropertyRowMapper.newInstance(DataSources.class));
		return result;
	}
}
