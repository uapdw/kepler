package uap.web.ecmgr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;




import uap.web.ecmgr.entity.EmallShopInfo;
import uap.web.ecmgr.entity.MgrRole;

public interface MgrRoleDao extends PagingAndSortingRepository<MgrRole, Long>,JpaSpecificationExecutor<MgrRole>{
	@Query("select max(role.id)+1 from MgrRole role")
	long getNextId();
	
	@Query("SELECT role FROM MgrRole role WHERE role.roleName=?")
	List<MgrRole> findByRoleName(String roleName);

	@Query("SELECT role FROM MgrRole role WHERE role.roleCode=?")
	List<MgrRole> findByRole_code(String roleCode);
	
	@Query("SELECT role FROM MgrRole role WHERE role.isActive=?")
	List<MgrRole> findByIsActive(String isactive);
}
