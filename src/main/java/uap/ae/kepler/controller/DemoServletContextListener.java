package uap.ae.kepler.controller;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.rosuda.REngine.REngine;
import org.rosuda.REngine.REngineStdOutput;

public class DemoServletContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent event) {
	}

	@Override
	public void contextInitialized(ServletContextEvent event) {

		// 主线程中启动R
		try {
			System.out.println("rJava开始连接");
			REngine.engineForClass("org.rosuda.REngine.JRI.JRIEngine", new String[0],
					new REngineStdOutput(), false);
			System.out.println("rJava连接成功");
		} catch (Exception e1) {
			System.out.println("rJava连接有异常");
			e1.printStackTrace();
		} catch (Throwable t) {
			System.out.println("rJava连接有错误,如未安装R请忽略.");
			t.printStackTrace();
		}

	}

}
