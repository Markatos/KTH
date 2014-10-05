import java.util.Date;
import java.util.Vector;

public class Functions {

	/**
	 * 
	 * @param board
	 * @return a value for the board
	 * TODO: TRY HUNGARY METHOD
	 */
	public static double heuristics(Board board) {
		return (double) Functions.hungarian(board);
		/*Vector<Position> goalCoordinates = board.getTargetsCoordinates();
		double boardValue = 0;
		double playerDistance = Double.POSITIVE_INFINITY;

		for (Position pos : board.getBoxCoordinates()) {
			// reset on each iteration
			double distance = Double.POSITIVE_INFINITY;
			
			for (Position goalPos : goalCoordinates) {
				double curDistance = Math.sqrt(Math.pow(goalPos.row() - pos.row(), 2)
						+ Math.pow(goalPos.column() - pos.column(), 2));
				if (curDistance < distance) {
					distance = curDistance;
				}
			}
			
			boardValue += distance;

			// calculate distance for player
			Position playerPos = board.getSokoPlayerCoordinates();
			double curPlayerDistance = Math.sqrt(Math.pow(playerPos.row() - pos.row(), 2)
					+ Math.pow(playerPos.column() - pos.column(), 2));
			if (curPlayerDistance < playerDistance)
				playerDistance = curPlayerDistance;
		}

		boardValue += playerDistance;
		
		
		return boardValue;*/
	}	
	
	
	
	public static int hungarian(Board b){		
		
		Vector<Position> allBoxes = b.getBoxCoordinates();
		Vector<Position> allGoals = b.getGoals();
		int[][] costs = new int[allGoals.size()][allBoxes.size()];
		
		for (int i = 0; i< allGoals.size(); i++){			
			for (int j = 0; j<allBoxes.size(); j++){
				costs[i][j] = Position.manhattanDistance(allGoals.get(i), allBoxes.get(j));

			}
		}
				
		int sum = HungarianAlgorithm.hgAlgorithm(costs, "min");
		
		return  sum;	
	}

	public static int totalManhattanDistance(Board board) {
		Vector<Position> goalCoordinates = board.getGoals();
		int boardValue = 0;
		for (Position pos : board.getBoxCoordinates()) {
			// reset on each iteration
			int distance = 1000000000;

			for (Position goalPos : goalCoordinates) {
				int curDistance = Math.abs(goalPos.x - pos.x) + Math.abs(goalPos.y-pos.y);
				if (curDistance < distance) {
					distance = curDistance;
				}
			}
			
			boardValue += distance;			
		}		
		return boardValue;
	}
		
	
	/**
	 * This function moves the player to the position specified by the direction in the arguments
	 * in case that a box is placed there, then it calls itself in order to move both the player and the box
	 * @param board
	 * @param direction
	 * @param src
	 * @throws IllegalArgumentException in case of an illegal move
	 * @return true if the move is a push
	 */
	public static boolean move(Board board, int direction, Position src) {
		int content = board.getCell(src); 
		int adj = board.getCell(src.get(direction));
		boolean isPush = false;
		//if we want to move the soko player
		if (content == Constants.SOKO) {
			if (adj == Constants.GOAL) {
				board.setCell(src, Constants.SPACE);
				board.setCell(src.get(direction), Constants.SOKO_ON_GOAL);
			}
			else if (adj == Constants.SPACE) {
				board.setCell(src, Constants.SPACE);
				board.setCell(src.get(direction), Constants.SOKO);
			}
			else if (adj == Constants.BOX || adj == Constants.BOX_ON_GOAL) {
				isPush = true;
				Functions.move(board, direction, src.get(direction));
				Functions.move(board, direction, src);				
			}
			else {
				throw new IllegalArgumentException();
			}			
		}
		//if we want to move the soko player standing on a goal
		else if (content == Constants.SOKO_ON_GOAL) {
			if (adj == Constants.GOAL) {
				board.setCell(src, Constants.GOAL);
				board.setCell(src.get(direction), Constants.SOKO_ON_GOAL);
			}
			else if (adj == Constants.SPACE) {
				board.setCell(src, Constants.GOAL);
				board.setCell(src.get(direction), Constants.SOKO);
			}
			else if (adj == Constants.BOX || adj == Constants.BOX_ON_GOAL) {
				isPush = true;
				Functions.move(board, direction, src.get(direction));
				//TODO CHANGED
				Functions.move(board, direction, src);
			}
			else {				
				throw new IllegalArgumentException();
			}	
		}
		//if we want to move a box
		else if (content == Constants.BOX) {
			if (adj == Constants.GOAL) {
				board.setCell(src, Constants.SPACE);
				board.setCell(src.get(direction), Constants.BOX_ON_GOAL);
				isPush = true;
			}
			else if (adj == Constants.SPACE) {
				board.setCell(src, Constants.SPACE);
				board.setCell(src.get(direction), Constants.BOX);
				isPush = true;
			}
			else {
				throw new IllegalArgumentException();
			}
		}
		//if we want to move a box on a goal
		else if (content == Constants.BOX_ON_GOAL) {
			if (adj == Constants.GOAL) {
				board.setCell(src, Constants.GOAL);
				board.setCell(src.get(direction), Constants.BOX_ON_GOAL);
				isPush = true;
			}
			else if (adj == Constants.SPACE) {
				board.setCell(src, Constants.GOAL);
				board.setCell(src.get(direction), Constants.BOX);
				isPush = true;
			}
			else {
				throw new IllegalArgumentException();
			}
		}
		//if the src is not a player nor a box
		else {
			throw new IllegalArgumentException();
		}
		return isPush;
	}
	
	
	
	/**
	*Mark Static Deadlocks
	*1. Remove all the boxes and the player from the board.
	*2. For every goal do:
	*2.1. Place a box on it (current box position = (x, y))
	*2.2. Create a list of adjacent positions to the box on the goal ((x+1,y),(x,y+1),(x-1,y),(x,y-1))
	*2.3. For every position in the list do:
	*	2.3.1. If position is a free space or target square then:
	*		2.3.1.1. If position (x+1,y) -> check for (x+2,y). If it is free space or target square, 
	*					then mark position (x+1,y) as visited
	*		         If position (x,y+1) -> check for (x,y+2). If it is free space or target square, 
	*					then mark position (x,y+1) as visited
	*		         If position (x-1,y) -> check for (x-2,y). If it is free space or target square, 
	*					then mark position (x-1,y) as visited
	*		         If position (x,y-1) -> check for (x,y-2). If it is free space or target square, 
	*					then mark position (x,y-1) as visited
	*		         (Use a different marker for each goal)
	*		2.3.1.2. Update current box position
	*3. At the end, all the cells of the board that are not marked are static deadlocks since a box in there could 
	*	never be pushed to a goal.
	*
	*A box at position (x - 1, y) can be pulled to (x, y) if the man is standing at position (x, y) and position (x + 1, y) 
	*is either empty or a target square. A similar condition of course applies for pulling in the y-direction.
	*
	*warning: markers are Constant.VISITED + # of the box
	* @return
	*TODO CHANGED
	*/
	public static Board markStaticDeadlocks(Board initial_board) {
		Board board = initial_board.deepCopy();
		Board deadlocks = initial_board.deepCopy();
		board.removeBoxes();
		board.removePlayer();
		Vector<Position> goals = board.getGoals();				
		for (int i=0 ;i<goals.size(); i++ ) {
			Position box = goals.get(i);
			board.markDeadlocksForOneBox(i, box);			
		}//end for				
		for (int i=0; i<board.rowsN; i++) {
			for (int j=0; j<board.columnsN; j++) {				
				if (board.cellIsEmpty(i, j)&& !board.cellIsTarget(i, j)) {					
					deadlocks.setCell(i, j, Constants.DEADLOCK);					
				}
			}
		}				
		return deadlocks;
	}
	
	/**
	 * Recognizes the tunnels in a map. In case there is a goal on the tunnel it still recognizes it as a tunnel 
	 * @param initial_board
	 * @return
	 */
	public static boolean[][] markTunnels(Board initial_board) {
		
		Board board = initial_board.deepCopy();
		board.removeBoxes();
		board.removePlayer();
		boolean[][] tunnels = new boolean[board.rowsN][board.columnsN];
		boolean[][] potentialTunnel = new boolean[board.rowsN][board.columnsN];
		boolean[][] potentialMoufaTunnel = new boolean[board.rowsN][board.columnsN];
		
		//find potential Tunnels
		for (int i=1; i<board.rowsN-1; i++) {
			for (int j=1; j<board.columnsN-1; j++) {
				if ((board.getCell(i, j)!=Constants.WALL) && (!potentialTunnel[i][j]) && (!board.cellIsTarget(i, j)) 
						&& (board.getCell(i-1, j)==Constants.WALL) && (board.getCell(i+1, j)==Constants.WALL)
						&& (board.getCell(i, j-1)!=Constants.WALL && board.getCell(i, j+1)!=Constants.WALL)) {
					potentialTunnel[i][j]=true;
				}//end if
				if ((board.getCell(i, j)!=Constants.WALL) && (!potentialTunnel[i][j]) && (!board.cellIsTarget(i, j))
						&& (board.getCell(i-1, j)!=Constants.WALL) && (board.getCell(i+1, j)!=Constants.WALL)
						&& (board.getCell(i, j-1)==Constants.WALL) && (board.getCell(i, j+1)==Constants.WALL)) {
					potentialTunnel[i][j]=true;
				}//end if
                if ((board.getCell(i, j)!=Constants.WALL) && (!potentialTunnel[i][j]) && (!board.cellIsTarget(i, j))
						&& ((board.getCell(i-1, j)==Constants.WALL) || (board.getCell(i+1, j)==Constants.WALL))
						&& (board.getCell(i, j-1)!=Constants.WALL && board.getCell(i, j+1)!=Constants.WALL)) {
					potentialMoufaTunnel[i][j]=true;
				}//end if
				if ((board.getCell(i, j)!=Constants.WALL) && (!potentialTunnel[i][j]) && (!board.cellIsTarget(i, j))
						&& (board.getCell(i-1, j)!=Constants.WALL) && (board.getCell(i+1, j)!=Constants.WALL)
						&& ((board.getCell(i, j-1)==Constants.WALL) || (board.getCell(i, j+1)==Constants.WALL))) {
					potentialMoufaTunnel[i][j]=true;
				}//end if
			}//end for
		}//end for
		
		//find tunnels
		for (int i=1; i<board.rowsN-1; i++) {
			for (int j=1; j<board.columnsN-1; j++) {
				if (potentialTunnel[i][j] && potentialTunnel[i][j-1]) {
					tunnels[i][j]=true;
					tunnels[i][j-1]=true;
				}//end if
				if (potentialTunnel[i][j] && potentialTunnel[i-1][j]) {
					tunnels[i][j]=true;
					tunnels[i-1][j]=true;
				}//end if
                                if (potentialTunnel[i-1][j] && potentialMoufaTunnel[i][j] && potentialTunnel[i+1][j]) {
					tunnels[i][j]=true;
					tunnels[i-1][j]=true;
                                        tunnels[i+1][j]=true;
				}//end if
                                if (potentialTunnel[i][j-1] && potentialMoufaTunnel[i][j] && potentialTunnel[i][j+1]) {
					tunnels[i][j]=true;
					tunnels[i][j-1]=true;
                                        tunnels[i][j+1]=true;
				}//end if
			}//end for
		}//end for
		
		return tunnels;
				
	}// end mark tunnels
	
	
	public static void floodFill(Board board, Position pos, boolean[][] flood){
		
		if (!(flood[pos.x][pos.y] || board.cellIsBox(pos) || board.cellIsWall(pos))){
			flood[pos.x][pos.y]=true;
			floodFill(board, pos.get(Constants.UP), flood);
			floodFill(board, pos.get(Constants.DOWN), flood);
			floodFill(board, pos.get(Constants.LEFT), flood);
			floodFill(board, pos.get(Constants.RIGHT), flood);
		}
	}
	
	public static int tunnelDirection(Position box, boolean[][] tunnels) {
		if (tunnels[box.x+1][box.y]) return Constants.DOWN;
		if (tunnels[box.x-1][box.y]) return Constants.UP;
		if (tunnels[box.x][box.y+1]) return Constants.RIGHT;
		if (tunnels[box.x][box.y-1]) return Constants.LEFT;
		return 0;
	}
	
	public static boolean isTunnelEntrance(Position box) {
		return Main.tunnels[box.x][box.y];
	}

}
	
