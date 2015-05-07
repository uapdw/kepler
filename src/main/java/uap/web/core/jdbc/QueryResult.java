package uap.web.core.jdbc;
import java.util.List;

public class QueryResult<T> {

	private List<T> list; // 结果集
	private int totalRow; // 总记录数

	public QueryResult() {
	}

	public QueryResult(List<T> list, int totalRow) {
		this.list = list;
		this.totalRow = totalRow;
	}

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}

	public int getTotalRow() {
		return totalRow;
	}

	public void setTotalRow(int totalRow) {
		this.totalRow = totalRow;
	}


}
