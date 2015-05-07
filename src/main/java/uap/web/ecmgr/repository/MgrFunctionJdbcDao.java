package uap.web.ecmgr.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import uap.web.core.jdbc.BaseJdbcDao;
import uap.web.ecmgr.entity.MgrFunction;

@Component
public class MgrFunctionJdbcDao extends BaseJdbcDao<MgrFunction> {

	public List<MgrFunction> findAllFuncsByUserId(long userId) {
//		String sql = "select * from mgr_function where isactive='Y' and id in (select func_id from mgr_role_func where role_id in (select role_id from mgr_role_user where user_id = ?))";
//		List<MgrFunction> result = (List<MgrFunction>) this.getJdbcTemplate().query(sql, new Object[] { userId }, BeanPropertyRowMapper.newInstance(MgrFunction.class));
//		return result;
		
		List<MgrFunction> list = new ArrayList<MgrFunction>();
		MgrFunction root = new MgrFunction();
		root.setId(0);
		root.setParentId(-1);
		root.setFuncCode("root");
		root.setFuncName("根节点");
		root.setFuncType("0");
		root.setChildren(new ArrayList<MgrFunction>());
		list.add(root);
		
		MgrFunction dmDemo = new MgrFunction();
		dmDemo.setId(1);
		dmDemo.setParentId(0);
		dmDemo.setFuncCode("dmDemo");
		dmDemo.setFuncName("数据挖掘演示");
		dmDemo.setFuncType("0");
		dmDemo.setChildren(new ArrayList<MgrFunction>());
		list.add(dmDemo);
		
		MgrFunction dataSource = new MgrFunction();
		dataSource.setId(11);
		dataSource.setParentId(1);
		dataSource.setFuncCode("dataSource");
		dataSource.setFuncName("数据源");
		dataSource.setFuncType("0");
		dataSource.setFuncUrl("/ae/dataSource/dataSource");
		dataSource.setChildren(new ArrayList<MgrFunction>());
		list.add(dataSource);
		
		MgrFunction explore = new MgrFunction();
		explore.setId(12);
		explore.setParentId(1);
		explore.setFuncCode("explore");
		explore.setFuncName("探查");
		explore.setFuncType("0");
		explore.setFuncUrl("/ae/explore/explore");
		explore.setChildren(new ArrayList<MgrFunction>());
		list.add(explore);
		
		MgrFunction publish = new MgrFunction();
		publish.setId(13);
		publish.setParentId(1);
		publish.setFuncCode("publish");
		publish.setFuncName("发布");
		publish.setFuncType("0");
		publish.setFuncUrl("/ae/publish/publish");
		publish.setChildren(new ArrayList<MgrFunction>());
		list.add(publish);
		
		root.getChildren().add(dmDemo);
		dmDemo.getChildren().add(dataSource);
		dmDemo.getChildren().add(explore);
		dmDemo.getChildren().add(publish);
		
		return list;
	}

	// 待完善
	public void addRoleUser(long userId){
		long id = getNextId();
		String sql = "insert into mgr_role_user(id, role_id, user_id) values("+ id +", '2', '"+ userId +"')";
		this.getJdbcTemplate().execute(sql);
	}
	
	public long getNextId(){
		String sql = "select max(id) + 1 from mgr_role_user";
		return this.getJdbcTemplate().queryForObject(sql, Long.class);
	}
}
