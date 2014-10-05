

public class Constants {
	/**
	 * These constants are used in the contents of squares in CBoard.
	 * the CELL_WHITE and CELL_RED constants are also used to refer
	 * to this and the other player
	 */
	public static final int CELL_EMPTY   = 0;    ///< the cell is empty
	public static final int CELL_RED     = 1<<0; ///< the cell belongs to the red player
	public static final int CELL_WHITE   = 1<<1; ///< the cell belongs to the white player
	public static final int CELL_KING    = 1<<2; ///< the cell is a king
	public static final int CELL_INVALID = 1<<3; ///< the cell is invalid

	public static final String[] SIMPLE_TEXT = {
			". ", // CELL_EMPTY
			"r ", // CELL_RED
			"w ", // CELL_WHITE
			"? ", // Unused
			"? ", // Unused
			"R ", // CELL_RED | CELL_KING
			"W ", // CELL_WHITE | CELL_KING
			"? ", // Unused
			"  ", // CELL_INVALID
	};

	public static final String[] UNICODE_TEXT = {
			". ", // CELL_EMPTY
			"⛂ ", // CELL_RED
			"⛀ ", // CELL_WHITE
			"? ", // Unused
			"? ", // Unused
			"⛃ ", // CELL_RED | CELL_KING
			"⛁ ", // CELL_WHITE | CELL_KING
			"? ", // Unused
			"  ", // CELL_INVALID
	};

	public static final String[] COLOR_TEXT = {
			". ", // CELL_EMPTY
			"\u001B[31m⛂ \u001B[0m", // CELL_RED
			"⛀ ", // CELL_WHITE
			"? ", // Unused
			"? ", // Unused
			"\u001B[31m⛃ \u001B[0m", // CELL_RED | CELL_KING
			"⛁ ", // CELL_WHITE | CELL_KING
			"? ", // Unused
			"  ", // CELL_INVALID
	};

	public static final char[] MESSAGE_SYMBOLS = {
		'.', // CELL_EMPTY
		'r', // CELL_RED
		'w', // CELL_WHITE
		'?', // Unused
		'?', // Unused
		'R', // CELL_RED | CELL_KING
		'W', // CELL_WHITE | CELL_KING
		'?', // Unused
		'_', // CELL_INVALID
	};
} // End class Constants
