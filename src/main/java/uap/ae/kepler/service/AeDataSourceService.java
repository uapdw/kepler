package uap.ae.kepler.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uap.ae.kepler.entity.DataSources;
import uap.ae.kepler.repository.AeDataSourceDao;

@Service
public class AeDataSourceService {

	@Autowired
	private AeDataSourceDao dao;
	
	public void saveEntity(DataSources db){
		dao.addDataSource(db);
	}
	
	
}
