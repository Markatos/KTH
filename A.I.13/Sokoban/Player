
import java.util.Stack;
import java.util.Vector;


public class Player {
	

	/*cTor*/
	public Player() {
		//nothing to do here really
	}
	
	public Vector<Node> dfs (Board b,  Position src, Vector<Position> dest) {
		
		Stack<Node> openList = new Stack<Node>();
		Vector<String> closedList = new Vector<String> ();
		Vector<Node> solutions = new Vector<Node>();		
		openList.add(new Node(src));
		closedList.add(src.toString());
		
		while (!openList.isEmpty()) {
			Node nodeCur = openList.pop();
			if (this.isDestination(nodeCur.player, dest)) {
				solutions.add(nodeCur);
			}
			Vector<Node> expanded = this.expandNode(b, nodeCur);
			for (Node temp: expanded) {
				if (!closedList.contains(temp.toString())) {
					openList.push(temp);
					closedList.add(temp.toString());
				}
			}
		}
		return solutions;
	}
	
	public Vector<Board> playerMoves(Board lBoard, Position src, Vector<Position> dest) {
		Board b= lBoard.deepCopy();
		Vector<Node> paths = this.dfs(b, src, dest);
		Vector<Board> playerMoves = new Vector<Board>();
		for (Node temp : paths) {			
			if(temp!=null){
				playerMoves.add(this.retBoard(temp.path, b, src, temp.player));
			}			
		}		
		return playerMoves;
	}
	
	
	
	public Board retBoard(String path, Board b, Position src, Position dest) {
		Board lBoard = b.deepCopy();
		if (src == dest) return b;
		if (b.getCell(src) == Constants.SOKO) {
			lBoard.setCell(src, Constants.SPACE);
		}
		else if (b.getCell(src) == Constants.SOKO_ON_GOAL) {
			lBoard.setCell(src, Constants.GOAL);
		}
		else {
			return null;
		}

		if (b.getCell(dest) == Constants.SPACE) lBoard.setCell(dest, Constants.SOKO);
		else if (b.getCell(dest) == Constants.GOAL) lBoard.setCell(dest, Constants.SOKO_ON_GOAL);
		else return null;
		
		lBoard.addPath(path);
		return lBoard;
	}
	
	
	
	
	public Vector<Position> possiblePlayerMoves(Board b, Position player) {		
		Vector<Position> playerMoves = new Vector<Position> ();		
		for (Position temp : player.adjacent()) {
			if (b.cellIsEmpty(temp))
				playerMoves.add(temp);
		}
		return playerMoves;	
	}

	
	public int getPlayerDistanceFromPos(Position pos, Board b) {
		Position player = b.getSokoPlayerCoordinates();
		return Position.manhattanDistance(pos, player);
	}
	
	
	
	public Vector<Node> expandNode(Board b, Node current) {
		Vector<Position> movesPos = this.possiblePlayerMoves(b, current.player);
		Vector<Node> nodesPos = new Vector<Node>();
		for (Position temp : movesPos) {
			String newPath = current.path + Position.directionToChar(temp.direction(current.player));
			Node nodeCur = new Node(temp, newPath);
			nodesPos.add(nodeCur);
		}
		return nodesPos;
	}
	
	public Node getMin(Vector<Node> nodes) {
		int min = 0;
		Node minNode = nodes.get(0);
		for (Node nodeCur : nodes) {
			if (nodeCur.value < min) {
				min = nodeCur.value;
				minNode = nodeCur;
			}
		}
		return minNode;		
	}
	
	public int hashPlayer(Position player) {
		int code = player.x*1000 + player.y;
		return code;
	}
	
	public boolean isDestination ( Position player, Vector<Position> destination) {
		for (Position temp : destination) {
			if (player.x == temp.x && player.y == temp.y) return true;
		}
		return false;
	}
	
	
}
