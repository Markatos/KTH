

import java.util.Date;
import java.util.Vector;


public class Board implements Comparable<Board>{
	
/*	public static final char SPACE = ' ';
	public static final char WALL = '#';
	public static final char GOAL = '.';
	public static final char SOKO = '@';
	public static final char SOKO_ON_GOAL = '+';
	public static final char BOX = '$';
	public static final char BOX_ON_GOAL = '*';
	public static final char DEADLOCK = 'd';
	public static final char NOT_USED = 'n';*/

	final int[][] board;
	final int rowsN;
	final int columnsN;
	private double value;
	private String path;
	int pushes;
	Player player;
	
	
	/*cTors*/
	public Board(int rows, int columns) {		
		board = new int[rows][columns];				
		this.rowsN=rows;
		this.columnsN=columns;
		path = new String();
		this.pushes = 0;
		this.player = new Player();
	}
	
	public Board(Board b) {
		board = b.board;
		this.rowsN = b.rowsN;
		this.columnsN = b.columnsN;
		this.path = b.path;		
		this.pushes = b.pushes;
		this.player = b.player;
	}
	
	/**
	 * creates a deep (independent) copy of the board
	 * @return
	 */
	public Board deepCopy() {
		Board newBoard = new Board(this.rowsN, this.columnsN);
		for (int i=0; i<this.rowsN; i++) {
			for (int j=0; j<this.columnsN; j++) {
				newBoard.setCell(i, j, this.getCell(i, j));
			}
		}
		newBoard.path = this.path;
		newBoard.pushes = this.pushes;
		newBoard.player = this.player;
		return newBoard;
		
	}
	
	
	/*GETTERS*/
	public int getCell (int row, int col) {
		return board[row][col];
	}
	
	public int getCell (Position co) {
		return board[co.row()][co.column()];
	}
		
	public int[] getRow(int row) {
		return board[row];
	}
	
	public int getLength(int row) {
		return board[row].length;
	}
	
	public int getHeight() {
		return board.length;
	}
	
	public double getValue() {
		return this.value;
	}
	
	
	public String getPath() {
		return this.path;
	}
	
	
	/*GET COORDINATES*/
	/**
	 * 
	 * @return a Vector containing the Positions of the targets(goals)
	 */
	public Vector<Position> getGoals() {
		Vector<Position> targets = new Vector<Position> ();
		for (int i=0; i<this.rowsN; i++) {
			for (int j=0; j<this.columnsN; j++) {
				if (this.cellIsTarget(i, j)) targets.add(new Position(i,j));						
			}
		}
		return targets;
	}
	
	/**
	 * 
	 * @return a Vector containing the Position of the boxes
	 */
	public Vector<Position> getBoxCoordinates() {
		Vector<Position> boxes = new Vector<Position> ();
		for (int i=0; i<this.rowsN; i++) {
			for (int j=0; j<this.columnsN; j++) {
				if (this.cellIsBox(i, j)) boxes.add(new Position(i,j));						
			}
		}
		return boxes;
	}
	
	/**
	 * 
	 * @return the position of the sokoban player
	 */
	public Position getSokoPlayerCoordinates() {
		for (int i=0; i<board.length; i++) {
			for (int j=0; j<board[i].length; j++) {
				if (this.cellIsPlayer(i, j)) return new Position(i,j);						
			}
		}
		return null;
	}
	
	/** 
     * @return a Vector containing the Position of the temporary walls 
     */
    public Vector<Position> getTempWallCoordinates() { 
        Vector<Position> tempWalls = new Vector<Position> (); 
        for (int i=0; i<this.rowsN; i++) { 
            for (int j=0; j<this.columnsN; j++) { 
                if (this.getCell(i, j) == Constants.TEMP_WALL || (this.getCell(i, j) == Constants.TEMP_WALL_GOAL)) tempWalls.add(new Position(i, j));                      
            } 
        } 
        return tempWalls; 
    } 

    
    public void convertBoxToTempWall(Position box) {
    	if (this.getCell(box)==Constants.BOX) this.setCell(box, Constants.TEMP_WALL);
    	else if (this.getCell(box)==Constants.BOX_ON_GOAL) this.setCell(box, Constants.TEMP_WALL_GOAL);
    	else {} //do nothing
    }
    

    public void convertTempWallsToBoxes() {
    	for (int i=0; i<this.rowsN; i++) {
    		for (int j=0; j<this.columnsN; j++) {
    			if (this.getCell(i, j)==Constants.TEMP_WALL) this.setCell(i, j, Constants.BOX);
    			else if (this.getCell(i, j)==Constants.TEMP_WALL_GOAL) this.setCell(i, j, Constants.BOX_ON_GOAL);
    			else {} //do nothing
    		}	
    	}
    }
    
    
  	public Vector<Position> getBoxesNotOnGoal() {
  		Vector<Position> boxes = new Vector<Position> ();
  		for (int i=0; i<this.rowsN; i++) {
  			for (int j=0; j<this.columnsN; j++) {
  				if (this.getCell(i, j)==Constants.BOX) boxes.add(new Position(i,j));
  			}
  		}
  		return boxes;
  	}
	
	/*SETTERS*/
    /**
     * 
     * @param row
     * @param col
     * @param a
     */
	public void setCell (int row, int col, int a) {
		board[row][col] = a;
	}
	
	/**
	 * 
	 * @param pos
	 * @param a
	 */
	public void setCell(Position pos, int a) {
		board[pos.row()][pos.column()] = a;		
	}
	
	public void setValue(double lValue) {
		this.value = lValue;
	}


	
	/*BOOLEANS*/
	/**
	 * checks if the content of the cell described by its position matches with the parameter content 
	 * @param pos
	 * @param content
	 * @return
	 */
	public boolean cellIs(Position pos, int content) {
		if (this.getCell(pos)==content)
			return true;
		return false;		
	}
	/**
	 * 
	 * @param row
	 * @param col
	 * @return true if cell at position (row, col) is space or a goal
	 */
	public boolean cellIsEmpty(int row, int col) {
		if (this.getCell(row, col)==Constants.SPACE 
				|| this.getCell(row, col)==Constants.GOAL) 
			return true;		
		return false;
	}
	
	/**
	 * 
	 * @param row
	 * @param col
	 * @return true if cell at position (row, col) is a goal (with any content - box, empty or player)
	 */
	public boolean cellIsTarget(int row, int col) {
		if (this.getCell(row, col)==Constants.GOAL 
				|| this.getCell(row, col)==Constants.SOKO_ON_GOAL 
				|| this.getCell(row, col) == Constants.BOX_ON_GOAL)
			return true;
		return false;
	}
	
	/**
	 * 
	 * @param row
	 * @param col
	 * @return true if cell at position (row, col) is a box (on a space or a goal)
	 */
	public boolean cellIsBox(int row, int col) {
		if(this.getCell(row, col)==Constants.BOX 
				|| this.getCell(row, col)==Constants.BOX_ON_GOAL)
			return true;
		return false;
	}
	
	/**
	 * 
	 * @param row
	 * @param col
	 * @return true if cell at position (row, col) is the soko player
	 */
	public boolean cellIsPlayer(int row, int col) {
		if (this.getCell(row, col)==Constants.SOKO 
				|| this.getCell(row, col)==Constants.SOKO_ON_GOAL) 
			return true;
		return false;
	}
	
	/**
	 * 
	 * @param pos
	 * @return true if cell at Position pos is a space or a goal 
	 */
	public boolean cellIsEmpty(Position pos) {
		if (this.getCell(pos)==Constants.SPACE 
				|| this.getCell(pos)==Constants.GOAL) 
			return true;		
		return false;
	}
	
	/**
	 * 
	 * @param pos
	 * @return true if cell at Position pos is visited
	 * used to identify static deadlocks
	 */
	public boolean cellIsVisited(Position pos) {
		if (this.getCell(pos)==Constants.VISITED) 
			return true;		
		return false;
	}
	
	/**
	 * 
	 * @param pos
	 * @return true if cell at Position pos is a goal (with any content - box, empty or player)
	 */
	public boolean cellIsTarget(Position pos) {
		if (this.getCell(pos)==Constants.GOAL 
				|| this.getCell(pos)==Constants.BOX_ON_GOAL
				|| this.getCell(pos)==Constants.SOKO_ON_GOAL)
			return true;
		return false;
	}
	
	/**
	 * 
	 * @param pos
	 * @return true if cell at Position pos is a box (on an empty square or a goal)
	 */
	public boolean cellIsBox(Position pos) {
		if(this.getCell(pos)==Constants.BOX 
				|| this.getCell(pos)==Constants.BOX_ON_GOAL)
			return true;
		return false;
	}
	
	/**
	 * 
	 * @param pos
	 * @return true if cell at Position pos is the player
	 */
	public boolean cellIsPlayer(Position pos) {
		if (this.getCell(pos)==Constants.SOKO 
				|| this.getCell(pos)==Constants.SOKO_ON_GOAL) 
			return true;
		return false;
	}
	
	
	public boolean cellIsWall(Position pos) {
		if (this.getCell(pos)==Constants.WALL || this.getCell(pos)==Constants.TEMP_WALL) return true;
		return false;
	}
	
	/*OTHER FUNCTIONS*/
	/**
	 * checks if there is a box not placed to a goal.
	 * @return true if map is solved
	 */
	public boolean isSolved() {				
		for (int i=0; i<this.rowsN; i++) {
			for (int j=0; j<this.columnsN; j++) {
				if (board[i][j]==Constants.BOX) {
					return false;
				}
			}
		}
		return true;		
	}
	
	/**
	 * 
	 * @param s
	 */
	public void addPath(String s) {
		path += s;
	}
	
	public void addPath(char c) {
		path += c;
	}
	/**
	 * 
	 */
	public void evaluateBoard() {
		this.value = Functions.heuristics(this);
	}
	
	/**
	 * 
	 */
	public void removeBoxes() {
		Vector<Position> boxes = this.getBoxCoordinates();
		for (Position co : boxes) {
			if (this.getCell(co)==Constants.BOX_ON_GOAL) this.setCell(co, Constants.GOAL);
			else  this.setCell(co.row(), co.column(), Constants.SPACE);
		}			
	}
	
	//applies only in boxes and the player
	public void removeItem(Position item) {
		if (this.getCell(item) == Constants.BOX) this.setCell(item, Constants.SPACE);		
		else if (this.getCell(item)==Constants.BOX_ON_GOAL) this.setCell(item, Constants.GOAL);
		else if (this.getCell(item)==Constants.SOKO) this.setCell(item, Constants.SPACE);
		else if (this.getCell(item)==Constants.SOKO_ON_GOAL) this.setCell(item, Constants.GOAL);
	}
	
	/**
	 * 
	 */
	public void removePlayer() {
		Position player = this.getSokoPlayerCoordinates();
		if (this.getCell(player)==Constants.SOKO_ON_GOAL) this.setCell(player, Constants.GOAL);
		else this.setCell(player.row(), player.column(), Constants.SPACE);
	}
	
	public Vector<Board> possiblePushes() {
		Vector<Position> boxes = this.getBoxCoordinates();
		Vector<Position> destinations = Position.adjToAllBoxes(boxes);
		Vector<Board> possiblePlayerPositions = this.player.playerMoves(this, this.getSokoPlayerCoordinates(), destinations);
		Vector<Board> pBoards = new Vector<Board>();
		
		for (Board boardCur : possiblePlayerPositions) {
			Position player = boardCur.getSokoPlayerCoordinates();
			Vector<Position> adjBoxes = boardCur.getBoxesNextToPlayer(player);
			//System.out.println("player in position :" + player.toString());
			
			for (Position box : adjBoxes) {
				Board lBoard = boardCur.deepCopy();
				try {
					//System.out.println("PLAYER GOES TO : " + lBoard.getSokoPlayerCoordinates().toString());
					if (Functions.isTunnelEntrance(box)&&lBoard.macroTunnels(box, Main.tunnels)){
						pBoards.add(lBoard);
					}
					else if (Functions.move(lBoard, box.direction(player), player)) {
		//				System.out.println(lBoard.toString());
						lBoard.addPath(Position.directionToChar(box.direction(player)));
						lBoard.pushes++;	
						pBoards.add(lBoard);
					}
					else{}
					
				}
				catch (IllegalArgumentException e) {
				}//do nothing
			}//end for box							
		}// end for lBoard
		return pBoards;
	}
	
	
	public Vector<Position> getBoxesNextToPlayer(Position player) {
		Vector<Position> adj = player.adjacent();
		Vector<Position> boxes = new Vector<Position>();		 
		for (Position lPos : adj) {
			if (this.cellIsBox(lPos)) boxes.add(lPos);
		}
		return boxes;
	}
	
	/**
	 * @return
	 */
	public boolean isDeadlock() {         
        Vector<Position> boxes = this.getBoxesNotOnGoal(); 
        for (Position boxCur: boxes) {         
        		if (Main.deadlocks.getCell(boxCur)==Constants.DEADLOCK || isFreezeDeadlock(boxCur)) {
            		this.convertTempWallsToBoxes();
            		return true;
                }
        		else this.convertTempWallsToBoxes();       	
        }                
        return false; 
    } 
	       
	
	 /** 
     * Freeze Deadlock 
     *  // the idea is that, when a box is blocked BOTH vertically AND horizontally then we have a freeze deadlock 
     *   If ( box is blocked vertically AND horizontally ) --> Freeze Deadlock 
     *   // 
     * 
     *1.  For every box in its current position (x,y) do: 
     *2.(We search if it's blocked vertically) 
     *2.1. If ( position(x,y+1) = wall  OR   position(x,y-1) = wall )  
     *      -->  box is blocked vertically --> mark box as wall 
     *2.2. If ( position(x,y+1) = staticDeadlock  AND  position(x,y-1) = staticDeadlock )  
     *      -->  box is blocked vertically --> mark box as wall 
     *2.3. If ( position(x,y+1) = box.blocked  OR  position(x,y-1) = box.blocked )   
     *      -->  box is blocked vertically --> mark box as wall 
     * 
     *3.(We search if it's blocked horizontally) 
     *3.1. If ( position(x+1,y) = wall  OR  position(x-1,y) = wall )  
     *      --> box is blocked horizontally --> mark box as wall 
     *3.2. If ( position(x+1,y) = staticDeadlock  AND  position(x-1,y) = staticDeadlock )  
     *      --> box is blocked horizontally --> mark box as wall 
     *3.3. If ( position(x+1,y) = box.blocked  OR position(x-1,y) = box.blocked )  
     *      --> box is blocked horizontally --> mark box as wall 
     */
	//
	public boolean isFreezeDeadlock(Position boxCur) {
    	boolean horizontallyBlocked = false;
    	boolean verticallyBlocked = false;    	
    	
    	this.convertBoxToTempWall(boxCur);
    	
    	//check if box is blocked by a wall horizontally:
    	if (this.cellIsWall(boxCur.get(Constants.LEFT)) || this.cellIsWall(boxCur.get(Constants.RIGHT))) horizontallyBlocked = true;    		
    	
    	//check if there is a simple deadlock square on both sides of the box
    	else if (Main.isStaticDeadlock(boxCur.get(Constants.LEFT)) && Main.isStaticDeadlock(boxCur.get(Constants.RIGHT))) horizontallyBlocked = true;    	
    	
    	//check if there is a box on at least one side that is frozen as well
    	else {
    		if (this.cellIsBox(boxCur.get(Constants.LEFT)) && this.isFreezeDeadlock(boxCur.get(Constants.LEFT))) horizontallyBlocked = true;
    		else if (this.cellIsBox(boxCur.get(Constants.RIGHT)) && this.isFreezeDeadlock(boxCur.get(Constants.RIGHT))) horizontallyBlocked = true;
    		else {}//do nothing
    	}
    	
    	//check if box is blocked by a wall vertically:
    	if (this.cellIsWall(boxCur.get(Constants.UP)) || this.cellIsWall(boxCur.get(Constants.DOWN))) verticallyBlocked = true;

    	//check if there is a simple deadlock square on both sides of the box
    	else if (Main.isStaticDeadlock(boxCur.get(Constants.UP)) && Main.isStaticDeadlock(boxCur.get(Constants.DOWN))) verticallyBlocked = true;
    	
    	//check if there is a box on at least one side that is frozen as well
    	else {
    		if (this.cellIsBox(boxCur.get(Constants.UP)) && this.isFreezeDeadlock(boxCur.get(Constants.UP))) verticallyBlocked = true;
    		else if (this.cellIsBox(boxCur.get(Constants.DOWN)) && this.isFreezeDeadlock(boxCur.get(Constants.DOWN))) verticallyBlocked = true;
    		else {} //do nothing
    	}
    	
    	if (verticallyBlocked && horizontallyBlocked) return true;
    	
    	return false;

    }
	
	/**
	 * 
	 * @param marker
	 * @param boxPos
	 */
	public void markDeadlocksForOneBox (int marker, Position boxPos) {
		this.setCell(boxPos, Constants.VISITED + marker);
		Vector<Position> adj = boxPos.adjacent();
		for (Position temp: adj) {		
			if (this.cellIsEmpty(temp)) {					
				boolean marked = false;
				
				if (temp.direction(boxPos) == Constants.LEFT) {	
					if ((this.cellIsEmpty(temp.get(Constants.LEFT)) || this.getCell(temp.get(Constants.LEFT)) >= Constants.VISITED) 
							&& (!this.cellIs(temp, Constants.VISITED + marker))) {						
						this.setCell(temp, Constants.VISITED + marker);
						marked = true;						
					}
						
				}					
				else if (temp.direction(boxPos) == Constants.RIGHT) {
					if ((this.cellIsEmpty(temp.get(Constants.RIGHT)) || this.getCell(temp.get(Constants.RIGHT)) >= Constants.VISITED) 
							&& (!this.cellIs(temp, Constants.VISITED + marker))){
						this.setCell(temp, Constants.VISITED + marker);
						marked = true;
					}
						
				}
				else if (temp.direction(boxPos) == Constants.UP) {			
					if ((this.cellIsEmpty(temp.get(Constants.UP)) || this.getCell(temp.get(Constants.UP)) >= Constants.VISITED) 
							&& (!this.cellIs(temp, Constants.VISITED + marker))){
						this.setCell(temp, Constants.VISITED + marker);
						marked = true;
					}
				}
				else if (temp.direction(boxPos) == Constants.DOWN) {
					if ((this.cellIsEmpty(temp.get(Constants.DOWN)) || this.getCell(temp.get(Constants.DOWN)) >= Constants.VISITED) 
							&& (!this.cellIs(temp, Constants.VISITED + marker))){
						this.setCell(temp, Constants.VISITED + marker);
						marked = true;
					}
				}
				else {
					throw new IndexOutOfBoundsException();
				}
				
				if (marked) {
					this.markDeadlocksForOneBox (marker, temp); 
				}
			}//end if
		}//end for
	}
	
	@Override
	public String toString() {
		String boardString = new String();
		for (int i=0; i<this.rowsN; i++) {
			for (int j=0; j<this.columnsN; j++) {
				boardString += Constants.toChar(this.getCell(i, j)); 
			}
			boardString += "\n";
		}
		//boardString += "Heuristic Value = " + Functions.heuristics(this) ;
		//boardString += "is Deadlock? = " + this.isDeadlock() + "\n";	
		//boardString += "pushes = " + this.pushes + "\n";
		return boardString;
	}
	
	
	
	@Override
	public int compareTo(Board b) {		
		return (b.getValue() < this.getValue() ? 1 : -1);		
	} 
	
	/**
	 * we assume that the move is legal
	 * moves the PLAYER to position pos
	 * @param pos
	 * @return
	 */
	public Board voidMove(Position pos) {
		Board newBoard = this.deepCopy();
		Position player = this.getSokoPlayerCoordinates();		
		if ((player.direction(pos)!= Constants.UNDEFINED) && (!this.cellIsBox(pos)) && (!this.cellIsWall(pos))) {
			newBoard.setCell(pos, this.getCell(pos)==Constants.GOAL ? Constants.SOKO_ON_GOAL : Constants.SOKO);
			newBoard.setCell(player, this.getCell(player)==Constants.SOKO ? Constants.SPACE: Constants.GOAL);
			newBoard.addPath(Position.directionToChar((pos.direction(player))));
			return newBoard;
		}
		else 
			return null;		
	}
	
	/**
	 * returns the topmost, leftmost corner of the room the player is placed
	 * @return
	 */
	public Position topLeftCorner() {
		Position player = this.getSokoPlayerCoordinates();
		boolean[][] flood = new boolean[this.rowsN][this.columnsN];
		Functions.floodFill(this, player, flood);
		for (int i=1; i<this.rowsN-1; i++) {
			for (int j=1; j<this.columnsN-1; j++) {
				if (flood[i][j]){
					return new Position(i,j);
				}
			}
		}
		return null;
	}
	
	
	public String hashIt() {               
        Vector<Position> boxes = this.getBoxCoordinates();
        String hash = new String("h");
        int i;
        for (i=0; i<boxes.size(); i++) { 
            hash += (boxes.get(i).x*100 + boxes.get(i).y); 
            hash += "x";
            
        } 
        Position player = this.topLeftCorner(); 
        i++;
        hash += (player.x*100 + player.y);   
        return hash; 
    }
	

	public boolean macroTunnels(Position box, boolean[][] tunnels){
	
		int sum=0;
		Position player = this.getSokoPlayerCoordinates();
		//check tunnel direction
		Position temp = new Position(box.x, box.y);
		int direction = Functions.tunnelDirection(box, tunnels);
		while (tunnels[temp.x][temp.y]) {
			if (this.cellIsBox(temp)||this.cellIsTarget(temp)) return false;
			temp = temp.get(direction);
			sum++;
		}
		Position newBoxPos = box.getMacro(sum, direction);
		Position newPlayerPos = box.getMacro(sum-1, direction);
		
		this.removeItem(box);
		this.removeItem(player);
		
		if (this.getCell(newBoxPos) == Constants.SPACE) this.setCell(newBoxPos, Constants.BOX);
		else this.setCell(newBoxPos, Constants.BOX_ON_GOAL);
		
		if (this.getCell(newPlayerPos) == Constants.SPACE) this.setCell(newPlayerPos, Constants.SOKO);
		else this.setCell(newPlayerPos, Constants.SOKO_ON_GOAL);
		
		String newPath = new String();
		for (int i=0; i<sum; i++) 
			newPath += Position.directionToChar(direction);
			
		this.addPath(newPath);
		this.pushes += sum;
		return true;
		
	}	

}
