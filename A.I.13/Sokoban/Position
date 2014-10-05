import java.util.Vector;


public class Position {
	int x; //row
	int y; //column
	
	/*cTor*/
	public Position (int x_c, int y_c) {
		this.x = x_c;
		this.y = y_c;
	}
	
	public int row() {
		return this.x;
	}
	
	public int column() {
		return this.y;		
	}	
	
	/**
	 * 
	 * @param direction
	 * @return the left/right/up/down (specified by the direction argument) position. 
	 */
	public Position get(int direction) {
		switch(direction) {
		case Constants.LEFT: return new Position(x, y-1);
		case Constants.RIGHT: return new Position(x, y+1);	
		case Constants.UP: return new Position(x-1, y);
		case Constants.DOWN: return new Position(x+1, y);
		default : throw new IllegalArgumentException();
		}
	}
	
	/**
	 * 
	 * @return a vector containing all the neighbor positions (Left, Right, Up, Down)
	 */
	public Vector<Position> adjacent() {
		Vector<Position> adj = new Vector<Position>();
		adj.add(this.get(Constants.LEFT));
		adj.add(this.get(Constants.RIGHT));
		adj.add(this.get(Constants.UP));
		adj.add(this.get(Constants.DOWN));
		return adj;		
	}
	
	public static Vector<Position> adjToAllBoxes(Vector<Position> boxes) {
		Vector<Position> adj = new Vector<Position>() ;
		for (Position box : boxes) {
			adj.addAll(box.adjacent());
		}
		return adj;
	}
	
	/**
	 * what kind of neighbor is this cell to cell in position pos
	 * @param pos
	 * @return
	 */
	public int direction(Position pos) {		
		int rowDist = this.row() - pos.row();
		if (rowDist == 1) return Constants.DOWN;
		if (rowDist == -1) return Constants.UP;
		int colDist = this.column() - pos.column();
		if (colDist == 1) return Constants.RIGHT;
		if (colDist == -1) return Constants.LEFT;
		return Constants.UNDEFINED;
	}
	
	public static char directionToChar(int direction) {
		switch(direction) {
		case Constants.LEFT: return 'L';
		case Constants.RIGHT: return 'R';
		case Constants.UP: return 'U';
		case Constants.DOWN: return 'D';
		default: return '-';
		}
	}
	
	public static int manhattanDistance(Position pos1, Position pos2) {
		return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
	}
	
	@Override
	public String toString() {
		return "[" + this.x + "," + this.y + "]";								
	}
	
	@Override 
	public boolean equals(Object obj) {
		Position pos = (Position)obj;
		return (this.x == pos.x || this.y == pos.y) ? true : false;
	}
	
	public Position getMacro(int moves, int direction) {
		Position pos = new Position(this.x, this.y);
		for (int i=0; i<moves; i++) {
			pos = pos.get(direction);
		}
		return pos;
	}
	
	
}
