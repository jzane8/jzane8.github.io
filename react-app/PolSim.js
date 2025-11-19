/**
 * PARTY OBJECT STRUCTURE
 * ======================
 * Each party object in the parties array should have the following properties:
 * 
 * @property {number} id - Unique identifier for the party (required)
 *                         Used as the React 'key' prop and for targeting specific parties
 * 
 * @property {string} name - Display name of the party (required)
 *                           Example: "Socialist Fervor", "Liberal Fervor"
 * 
 * @property {number} count - Current fervor/counter value (required)
 *                            Represents the party's strength or support level
 * 
 * @property {string} position - Screen position for rendering (required)
 *                               Valid values: "left", "center", "right"
 *                               Determines which section the party appears in
 * 
 * @property {boolean} visible - Whether the party is currently displayed (required)
 *                               Set to false to hide without deleting from state
 * 
 * @property {string} color - Optional CSS color for styling (optional)
 *                            Example: "#dc3545", "rgb(220, 53, 69)", "red"
 * 
 * Example party object:
 * {
 *     id: 1,
 *     name: "Socialist Fervor",
 *     count: 0,
 *     position: "left",
 *     visible: true,
 *     color: "#dc3545"
 * }
 */

function PoliticalSimulator({ initialParties = null }) {
    // Load from localStorage if available, otherwise use initialParties or defaults
    const getInitialState = () => {
        const saved = localStorage.getItem('parties');
        if (saved) return JSON.parse(saved);
        if (initialParties) return initialParties;
        return [/* default parties */];
    };
    
    const [parties, setParties] = useState(getInitialState());
    const [nextId, setNextId] = useState(
        Math.max(...parties.map(p => p.id), 0) + 1
    );
    
    // Save to localStorage whenever parties change
    useEffect(() => {
        localStorage.setItem('parties', JSON.stringify(parties));
    }, [parties]);
    
    // ========================================================================
    // ADD PARTY: Dynamically create a new party and add it to the state
    // ========================================================================
    // Parameters:
    //   - name: String, the display name for the new party (required)
    //   - position: String, where to render the party ("left", "center", "right")
    //               Defaults to "center" if not provided
    //   - color: String, optional CSS color for custom styling
    // 
    // This function creates a new party object with all required properties
    // and adds it to the parties array using React's state updater function
    const addParty = (name, position = "center", color = null) => {
        // Validate that a name was provided
        // Without a name, the party wouldn't have a meaningful display
        if (!name || name.trim() === "") {
            console.error("Party name is required");
            return;
        }
        
        // Create the new party object with all required properties
        const newParty = {
            id: nextId,                    // Use the tracked nextId for uniqueness
            name: name.trim(),             // Remove extra whitespace from name
            count: 0,                      // All new parties start at 0 fervor
            position: position,            // Use provided position or default "center"
            visible: true,                 // New parties are visible by default
            ...(color && { color: color }) // Only add color property if provided (spread operator)
                                           // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        };
        
        // Update the parties state using the functional form of setState
        // This ensures we're working with the most current state
        // The spread operator [...prevParties, newParty] creates a new array
        // with all existing parties plus the new one at the end
        // https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
        setParties(prevParties => [...prevParties, newParty]);
        
        // Increment the nextId counter so the next party gets a unique ID
        // This prevents ID collisions which would break React's reconciliation
        setNextId(nextId + 1);
        
        console.log(`Added party: ${name} at position ${position}`);
    };
    
    // ========================================================================
    // DELETE PARTY: Permanently remove a party from the state
    // ========================================================================
    // Parameter:
    //   - partyId: Number, the unique ID of the party to delete
    // 
    // This function filters out the party with the matching ID from the array
    // Note: This is different from hiding a party (setting visible: false)
    //       Deleted parties are completely removed and cannot be recovered
    //       unless you re-add them with addParty()
    const deleteParty = (partyId) => {
        // Optional: Find the party name for logging purposes before deletion
        const deletedParty = parties.find(p => p.id === partyId);
        
        // Update parties state using the functional form
        // filter() creates a new array containing only parties that pass the test
        // We keep all parties EXCEPT the one with the matching ID
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        setParties(prevParties => 
            prevParties.filter(party => party.id !== partyId)
        );
        
        if (deletedParty) {
            console.log(`Deleted party: ${deletedParty.name}`);
        }
    };
    
    // ... rest of component
}
