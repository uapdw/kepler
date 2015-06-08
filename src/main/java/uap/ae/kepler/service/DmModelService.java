package uap.ae.kepler.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import uap.ae.kepler.entity.DmModel;

@Service
public class DmModelService {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public List<DmModel> loadAllDmModels() {
		String sql = "select pk_dmmodel as pkdmmodel, modelname, modelType, model, comments, creator, createTime, modifier, modifyTime from ae_dm_model";
		List<DmModel> result = jdbcTemplate.query(sql,
				BeanPropertyRowMapper.newInstance(DmModel.class));
		return result;
	}
	
	public List<DmModel> loadDmModelByPk(String pkDmModel) {
		String sql = "select pk_dmmodel as pkdmmodel, modelname, modelType, model, comments, creator, createTime, modifier, modifyTime from ae_dm_model where pk_dmmodel = '" + pkDmModel + "'";
		List<DmModel> result = jdbcTemplate.query(sql,
				BeanPropertyRowMapper.newInstance(DmModel.class));
		return result;
	}
}
