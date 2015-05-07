package uap.web.core.jdbc;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public interface IBaseDao<T> {

	public static final String SQL_INSERT = "insert";
	public static final String SQL_UPDATE = "update";
	public static final String SQL_DELETE = "delete";

	public void save(T entity);

	public void update(T entity);

	public void delete(T entity);

	public void delete(Serializable id);
	
	public void deleteAll();

	public void batchSave(List<T> list);
	
	public void batchUpdate(List<T> list);
	
	public void batchDelete(List<T> list);
	
	public T findById(Serializable id);
	
	public List<T> findAll();
	
	public QueryResult<T> findByPage(int pageNo, int pageSize);
	
	public QueryResult<T> findByPage(int pageNo, int pageSize, Map<String, String> where);
	
	public QueryResult<T> findByPage(int pageNo, int pageSize, LinkedHashMap<String, String> orderby);
	
	public QueryResult<T> findByPage(int pageNo, int pageSize, Map<String, String> where,LinkedHashMap<String, String> orderby);


}
