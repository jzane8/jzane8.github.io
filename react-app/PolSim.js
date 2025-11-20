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

/**
 * PARLIAMENT OBJECT STRUCTURE
 * ============================
 * The parliament state manages organizational structures using party ID references.
 * This allows parties to appear in multiple contexts without data duplication.
 * 
 * @property {Array<number>} favoredParties - Array of party IDs that are currently favored/empowered
 * @property {Array<Object>} factions - Array of faction objects representing coalitions/groups
 * 
 * Faction object structure:
 * {
 *     id: number,                    // Unique identifier for the faction
 *     name: string,                  // Display name of the faction
 *     memberPartyIds: Array<number>  // Array of party IDs in this faction
 * }
 * 
 * Example parliament object:
 * {
 *     favoredParties: [1, 3],
 *     factions: [
 *         {
 *             id: 1,
 *             name: "Progressive Alliance",
 *             memberPartyIds: [1, 3, 5]
 *         },
 *         {
 *             id: 2,
 *             name: "Conservative Coalition",
 *             memberPartyIds: [2, 4]
 *         }
 *     ]
 * }
 * 
 * Note: Parliament stores only party IDs, not full party objects. This ensures
 * that when a party's data (name, count, etc.) changes, it's automatically
 * reflected everywhere the party appears without manual synchronization.
 */

const { useState, useEffect } = React;

function PoliticalSimulator({ initialParties = null }) {
    // Load from localStorage if available, otherwise use initialParties or defaults
    const getInitialState = () => {
        const saved = localStorage.getItem('parties');
        if (saved) return JSON.parse(saved);
        if (initialParties) return initialParties;
        return [/* default parties */];
    };
    
    // CHANGE: Added parliament state initialization with localStorage support
    const getInitialParliamentState = () => {
        const saved = localStorage.getItem('parliament');
        if (saved) return JSON.parse(saved);
        return {
            favoredParties: [],      // Array of party IDs that are currently favored
            factions: [],            // Array of faction objects: { id, name, memberPartyIds }
            // Add other organizational structures as needed
        };
    };
    
    const [parties, setParties] = useState(getInitialState());
    const [nextId, setNextId] = useState(
        Math.max(...parties.map(p => p.id), 0) + 1
    );
    
    // CHANGE: Added parliament state for organizational structure using ID references
    const [parliament, setParliament] = useState(getInitialParliamentState());
    const [nextFactionId, setNextFactionId] = useState(
        parliament.factions.length > 0 
            ? Math.max(...parliament.factions.map(f => f.id), 0) + 1 
            : 1
    );
    
    // Save to localStorage whenever parties change
    useEffect(() => {
        localStorage.setItem('parties', JSON.stringify(parties));
    }, [parties]);
    
    // CHANGE: Save parliament state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('parliament', JSON.stringify(parliament));
    }, [parliament]);

    const partyTitles = () => {
        return parties.map(party => party.name);

    }
    
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
    
    // ========================================================================
    // UPDATE PARTY COUNT: Modify the count value for a specific party
    // ========================================================================
    // Parameter:
    //   - partyId: Number, the unique ID of the party to update
    //   - newCount: Number, the new count value to set
    // 
    // CHANGE: Added to enable child components (CounterApp) to update party counts
    // This creates a two-way data flow: parent passes data down, child calls this
    // function to update parent state when counter buttons are clicked
    const updatePartyCount = (partyId, newCount) => {
        setParties(prevParties => 
            prevParties.map(party => 
                party.id === partyId 
                    ? { ...party, count: newCount }  // Update count for matching party
                    : party                          // Keep other parties unchanged
            )
        );
    };
    
    // ========================================================================
    // PARLIAMENT MANAGEMENT FUNCTIONS
    // ========================================================================
    // These functions manage the parliament state, which stores organizational
    // structures using party ID references (not full party objects)
    
    // ------------------------------------------------------------------------
    // FAVORED PARTIES: Manage which parties are currently favored/empowered
    // ------------------------------------------------------------------------
    
    /**
     * Add a party to the favored parties list
     * @param {number} partyId - The ID of the party to favor
     */
    const addFavoredParty = (partyId) => {
        // TODO: Implement - add partyId to parliament.favoredParties array
        // Check if party exists and isn't already favored
        setParliament
    };
    
    /**
     * Remove a party from the favored parties list
     * @param {number} partyId - The ID of the party to unfavor
     */
    const removeFavoredParty = (partyId) => {
        // TODO: Implement - remove partyId from parliament.favoredParties array
    };
    
    /**
     * Toggle a party's favored status
     * @param {number} partyId - The ID of the party to toggle
     */
    const toggleFavoredParty = (partyId) => {
        // TODO: Implement - add if not present, remove if present
    };
    
    /**
     * Get full party objects for all favored parties
     * @returns {Array} Array of party objects that are currently favored
     */
    const getFavoredParties = () => {
        // TODO: Implement - map favoredParties IDs to actual party objects
        return parliament.favoredParties.map(id => 
            parties.find(p => p.id === id)
        ).filter(p => p !== undefined);
    };
    
    // ------------------------------------------------------------------------
    // FACTIONS: Manage groups/coalitions of parties
    // ------------------------------------------------------------------------
    
    /**
     * Create a new faction with member parties
     * @param {string} name - Name of the faction
     * @param {Array<number>} memberPartyIds - Array of party IDs in this faction
     * @returns {number} The ID of the newly created faction
     */
    const createFaction = (name, memberPartyIds = []) => {
        // TODO: Implement - create faction object and add to parliament.factions
        // Validate that all party IDs exist
        // Return the new faction ID
    };
    
    /**
     * Delete a faction
     * @param {number} factionId - The ID of the faction to delete
     */
    const deleteFaction = (factionId) => {
        // TODO: Implement - remove faction from parliament.factions array
    };
    
    /**
     * Add a party to an existing faction
     * @param {number} factionId - The ID of the faction
     * @param {number} partyId - The ID of the party to add
     */
    const addPartyToFaction = (factionId, partyId) => {
        // TODO: Implement - add partyId to faction's memberPartyIds array
        // Check if party exists and isn't already in faction
    };
    
    /**
     * Remove a party from a faction
     * @param {number} factionId - The ID of the faction
     * @param {number} partyId - The ID of the party to remove
     */
    const removePartyFromFaction = (factionId, partyId) => {
        // TODO: Implement - remove partyId from faction's memberPartyIds array
    };
    
    /**
     * Get full party objects for all members of a faction
     * @param {number} factionId - The ID of the faction
     * @returns {Array} Array of party objects in this faction
     */
    const getFactionParties = (factionId) => {
        // TODO: Implement - find faction and map memberPartyIds to party objects
        const faction = parliament.factions.find(f => f.id === factionId);
        if (!faction) return [];
        return faction.memberPartyIds.map(id => 
            parties.find(p => p.id === id)
        ).filter(p => p !== undefined);
    };
    return (
        <div>
        <h2>Empowered party</h2>
        {/* CHANGE: Pass full party objects instead of just titles, and pass update callback */}
        {/* This allows CounterApp to access party.count and update it via updatePartyCount */}
        <CounterAppList 
            parties={parties}                    // Pass full party objects with id, name, count
            onCountChange={updatePartyCount}     // Pass callback to update counts
        />
        </div>
    );
    // ... rest of component
}

window.PoliticalSimulator = PoliticalSimulator;
