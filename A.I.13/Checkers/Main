import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;

public class Main {

	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws IOException {
		// Parse parameters
		boolean init = false;
		boolean verbose = false;
		boolean fast = false;
		
		for (int i = 0; i < args.length; ++i) {
			String param = args[i];
			
			if (param.equals("init") || param.equals("i")) {
				init = true;
			} else if (param.equals("verbose") || param.equals("v")) {
				verbose = true;
			} else if (param.equals("fast") || param.equals("f")) {
				fast = true;
			} else {
				System.err.println("Unknown parameter: '" + args[i] + "'");
				return;
			}
		}

		/**
		 * Start the game by sending the starting board without moves 
		 * if the parameter "init" is given
		 */
		if (init) {
			String message = new GameState().toMessage();
			//System.err.println("Sending initial board: '" + message + "'");
			System.out.println(message);
		} // End if

		Player player = new Player();

		String input_message;
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		while ((input_message = br.readLine()) != null) {
			// Deadline is one second from when we receive the message
			Deadline deadline = new Deadline(new Date(new Date().getTime() + (fast ? (long) 1e5 : (long) 1e6)));

			// Get game state from standard input
			//System.err.println("Receiving: '" + input_message + "'");
			GameState input_state = new GameState(input_message);

			// See if we would produce the same message
			if (!input_state.toMessage().equals(input_message)) {
				System.err.println("*** ERROR! ***");
				System.err.println("Interpreted: '" + input_message + "'");
				System.err.println("As:          '" + input_state.toMessage() + "'");
				System.err.println(input_state.toString(input_state.getNextPlayer()));
				assert(false);
			} // End if

			// Print the input state
			if (verbose) {
				System.err.println(input_state.toMessage());
				System.err.println(input_state.toString(input_state.getNextPlayer()));
			} // End if
			
			// Quit if this is end of game
			if (input_state.getMove().isEOG()) {
				break;
			} // End if
			
			// Figure out the next move
			GameState output_state = player.play(input_state, deadline);

			// Print the output state
			if (verbose) {
				System.err.println(output_state.toMessage());
				System.err.println(output_state.toString(input_state.getNextPlayer()));
			} // End if
			
			// Send the next move
			String output_message = output_state.toMessage();
			//System.err.println("Sending: '" + output_message + "'");
			System.out.println(output_message);

			// Quit if this is end of game
			if (output_state.getMove().isEOG()) {
				break;
			} // End if
		} // End while
	} // End main

} // End class Main
