public class Node {

	Position player;
	String path;
	int value;
	
	
	public Node(Position p){
		this.player = p;
		this.path = new String();
	}
	
	public Node(Position lPos, String lPath){
		this.player = lPos;
		this.path = lPath;
	}
	
	
	public String getPath() {
		return path;
	}
	
	public void addPath(String str){
		path += str;
	}
	
	public void addPath(char c) {
		path += c;
	}
	
	@Override 
	public String toString() {
		return player.toString();
	}
	
	public void print() {
		System.out.println(this.toString() + "\t" + path);
	}
	
	
}
