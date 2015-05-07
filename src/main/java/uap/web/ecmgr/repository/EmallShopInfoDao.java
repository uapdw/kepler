package uap.web.ecmgr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import uap.web.ecmgr.entity.EmallShopInfo;

@Repository
public interface EmallShopInfoDao extends PagingAndSortingRepository<EmallShopInfo, Long>, JpaSpecificationExecutor<EmallShopInfo> {
	EmallShopInfo findById(Long id);

	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.shopName=?")
	List<EmallShopInfo> findByShopName(String shopName);

	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.shopTitle=?")
	List<EmallShopInfo> findByShopTitle(String shopTitle);

//	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.shop_logo = ?")
//	List<EmallShopInfo> findByLogo(String shopLogo);
//
//	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.email = ?")
//	List<EmallShopInfo> findByEmail(String email);
//
//	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.phone = ?")
//	List<EmallShopInfo> findByPhone(String phone);
//
//	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.promation_show_status = ?")
//	List<EmallShopInfo> findByPromationShowStatus(BigDecimal promationShowStatus);
//
//	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.withdrawal_name = ?")
//	List<EmallShopInfo> findByWithdrawal(String withdrawalName);
//
//	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.company_name = ?")
//	List<EmallShopInfo> findByCompany(String companyName);
//
//	@Query("SELECT shopInfo FROM EmallShopInfo shopInfo WHERE shopInfo.customer_code = ?")
//	List<EmallShopInfo> findByCustomer(String customerCode);

	@Query("select max(shop.id)+1 from EmallShopInfo shop")
	long getNextId();
}
