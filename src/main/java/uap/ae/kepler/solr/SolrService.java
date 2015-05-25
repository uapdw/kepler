package uap.ae.kepler.solr;

import org.apache.solr.client.solrj.impl.CloudSolrClient;

/**
 * Solr提供相关服务类
 * @author Guoqinga 2015-05-21
 *
 */
public class SolrService {
	
	/**
	 * Solr 服务hosts
	 */
	
	private String solrCloudHosts;
	
	/**
	 * Solr客户端
	 */
	
	private CloudSolrClient cloudSolrClient;
	
	public SolrService(String solrCloudHosts) {
		this.solrCloudHosts = solrCloudHosts;
	}
	
	/**
	 * 获取CloudSolrClient
	 * @return CloudSolrClient
	 */
	
	public CloudSolrClient getCloudSolrClient() {
		if (null == cloudSolrClient) {
			cloudSolrClient = new CloudSolrClient(solrCloudHosts);
		}
		
		return cloudSolrClient;
	}

}
