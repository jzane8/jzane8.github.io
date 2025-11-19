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
    
    const addParty = (name, position = "center") => {
        // ... add party logic
    };
    
    const deleteParty = (partyId) => {
        // ... delete party logic
    };
    
    // ... rest of component
}




