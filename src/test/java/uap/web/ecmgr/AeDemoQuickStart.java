package uap.web.ecmgr;

import org.eclipse.jetty.server.Server;
import org.rosuda.REngine.REngine;
import org.rosuda.REngine.REngineStdOutput;
import org.springside.modules.test.jetty.JettyFactory;
import org.springside.modules.test.spring.Profiles;

/**
 * 使用Jetty运行调试Web应用, 在Console输入回车快速重新加载应用.
 * 
 * @author calvin
 */
public class AeDemoQuickStart {

	public static final int PORT = 8088;
	public static final String CONTEXT = "/ecmgr";
	public static final String[] TLD_JAR_NAMES = new String[] { "spring-webmvc", "shiro-web",
			"springside-core" };

	public static void main(String[] args) throws Exception {
		// 设定Spring的profile
		Profiles.setProfileAsSystemProperty(Profiles.PRODUCTION);

		// 启动Jetty
		Server server = JettyFactory.createServerInSource(PORT, CONTEXT);
		JettyFactory.setTldJarNames(server, TLD_JAR_NAMES);
		
		//主线程中启动R
		try {
			REngine.engineForClass("org.rosuda.REngine.JRI.JRIEngine", args, new REngineStdOutput(), false);
		} catch (Exception e1) {
			System.out.println("rJava连接有异常");
			e1.printStackTrace();
		}

		try {
			server.start();

			System.out.println("[INFO] Server running at http://localhost:" + PORT + CONTEXT);
			System.out.println("[HINT] Hit Enter to reload the application quickly");
			System.out.println("[INFO] server started");

			// 等待用户输入回车重载应用.
			while (true) {
				char c = (char) System.in.read();
				if (c == '\n') {
					JettyFactory.reloadContext(server);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}
}
