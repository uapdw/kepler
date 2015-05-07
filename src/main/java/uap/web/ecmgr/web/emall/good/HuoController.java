package uap.web.ecmgr.web.emall.good;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import uap.aert.dm.model.DmProjectModel;
import uap.aert.dm.model.WorkflowGroupModel;
import uap.aert.dm.model.WorkflowModel;
import uap.pub.ae.model.IModelWrapper;
import uap.pub.ae.model.ModelPackage;
import uap.pub.ae.model.ModelServiceRequest;
import uap.pub.ae.model.ModuleType;
import uap.pub.ae.model.handle.ModelServiceClient;
import uap.web.ecmgr.entity.HuoEntity;

@Controller
@RequestMapping(value = "/emall/huo")
public class HuoController {

	private ModelServiceClient getClient() {
		return new ModelServiceClient("20.2.52.42", "8081");
	}

	private ModelServiceRequest getRequest(ModelPackage mp) {
		ModelServiceRequest request = new ModelServiceRequest();
		request.setUsername("13");
		request.setPassword("ufsoft*123");
		request.setDs("design");
		request.setModelPackage(mp);
		return request;
	}

	@RequestMapping(value = "loadTreeData", method = RequestMethod.GET)
	public @ResponseBody IModelWrapper[] loadTreeData() {

		ModelServiceClient client = getClient();
		ModelPackage mp = new ModelPackage("design", ModuleType.DM);
		ModelServiceRequest request = getRequest(mp);
		IModelWrapper[] result = null;
		try {
			result = client.loadProjects(request);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException();
		}

		IModelWrapper[] prjs = allModelToArray((DmProjectModel[]) result);
		return prjs;

		// WorkflowModel wf1 = new WorkflowModel();
		// wf1.setPkWorkflow("pk1");
		// wf1.setWfName("wfName1");
		//
		// WorkflowModel wf2 = new WorkflowModel();
		// wf2.setPkWorkflow("pk2");
		// wf2.setWfName("wfName2");
		//
		// WorkflowModel wf3 = new WorkflowModel();
		// wf3.setPkWorkflow("pk3");
		// wf3.setWfName("wfName3");
		//
		// IModelWrapper[] array = new IModelWrapper[3];
		// array[0] = wf1;
		// array[1] = wf2;
		// array[2] = wf3;
		// return array;
	}

	private IModelWrapper[] allModelToArray(DmProjectModel[] projectModels) {
		List<IModelWrapper> list = new ArrayList<IModelWrapper>();
		for (DmProjectModel project : projectModels) {
			list.add(project);
			IModelWrapper[] groups = project
					.getChildren(WorkflowGroupModel.class.getName());
			if (groups != null && groups.length > 0) {
				for (IModelWrapper group : groups) {
					reAddGroup(list, group);
				}
			}
		}
		return list.toArray(new IModelWrapper[list.size()]);
	}

	private void reAddGroup(List<IModelWrapper> list, IModelWrapper group) {
		list.add(group);
		IModelWrapper[] subGroups = group.getChildren(WorkflowGroupModel.class
				.getName());
		if (subGroups == null || subGroups.length == 0) {
			return;
		}
		for (IModelWrapper subGroup : subGroups) {
			reAddGroup(list, subGroup);
		}
	}

	@RequestMapping(value = "loadWorkflow", method = RequestMethod.GET)
	public @ResponseBody Page<WorkflowModel> loadWorkflow(
			@RequestParam(value = "id", defaultValue = "auto") String id) {
		String[] params = id.split("\\^");
		if (params.length != 2) {
			return null;
		}
		String pk = params[1];
		String type = params[0];

		ModelServiceClient client = getClient();
		ModelPackage mp = new ModelPackage("design", ModuleType.DM, pk);
		ModelServiceRequest request = getRequest(mp);
		IModelWrapper[] result = null;

		try {
			if ("prj".equals(type)) {
				result = client.loadModelByProject(request);
			} else if ("grp".equals(type)) {
				result = client.loadModelByGroup(request);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (result == null || result.length == 0) {
			return null;
		}
		List<WorkflowModel> list = new ArrayList<WorkflowModel>();
		for (IModelWrapper model : result) {
			if (!(model instanceof WorkflowModel)) {
				continue;
			}
			list.add((WorkflowModel) model);
		}
		// HuoEntity huo1 = new HuoEntity();
		// huo1.setCode("bac");
		// huo1.setName("huoqi");
		//
		// HuoEntity huo2 = new HuoEntity();
		// huo2.setCode("huo2");
		// huo2.setName("huoqi2");
		//
		// List<HuoEntity> list = new ArrayList<HuoEntity>();
		// list.add(huo1);
		// list.add(huo2);
		//
		Page<WorkflowModel> pages = new PageImpl<WorkflowModel>(list);
		return pages;
	}

	/**
	 * 进入更新界面
	 * 
	 * @param code
	 * @param model
	 * @return 需要更新的实体的json结构
	 */
	@RequestMapping(value = "update", method = RequestMethod.GET)
	public @ResponseBody HuoEntity updateForm(@RequestParam("pkWorkflow") String pkWorkflow) {
		HuoEntity huo = new HuoEntity();
		huo.setCode("bac");
		huo.setName("huoqi22");
		return huo;
	}

	/** 保存更新 */
	@RequestMapping(value = "save", method = RequestMethod.POST)
	public @ResponseBody HuoEntity save(@RequestBody HuoEntity huo) {
		HuoEntity huo2 = new HuoEntity();
		huo2.setCode("bac");
		huo2.setName("huoqi22");
		return huo2;
	}
}
