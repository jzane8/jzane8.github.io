import { useState, useEffect, useCallback } from 'react';
import CounterAppList from './CounterAppList';

/**
 * Political Simulator — manages parties, factions, and a parliament structure.
 * Parties with count >= FAVOR_THRESHOLD are automatically added to favored list.
 * State persists to localStorage.
 */

const FAVOR_THRESHOLD = 10;

export default function PolSim({ initialParties = [] }) {
  // --- Parties state ---
  const [parties, setParties] = useState(() => {
    const saved = localStorage.getItem('parties');
    if (saved) return JSON.parse(saved);
    return initialParties;
  });

  const [nextId, setNextId] = useState(
    () => Math.max(...parties.map((p) => p.id), 0) + 1
  );

  useEffect(() => {
    localStorage.setItem('parties', JSON.stringify(parties));
  }, [parties]);

  // --- Parliament state ---
  const [parliament, setParliament] = useState(() => {
    const saved = localStorage.getItem('parliament');
    if (saved) return JSON.parse(saved);
    return { favoredParties: [], factions: [] };
  });

  const [nextFactionId, setNextFactionId] = useState(
    () =>
      parliament.factions.length > 0
        ? Math.max(...parliament.factions.map((f) => f.id), 0) + 1
        : 1
  );

  useEffect(() => {
    localStorage.setItem('parliament', JSON.stringify(parliament));
  }, [parliament]);

  // --- Party CRUD ---
  const addParty = useCallback(
    (name, position = 'center', color = null) => {
      if (!name?.trim()) return;
      setNextId((prevId) => {
        const newParty = {
          id: prevId,
          name: name.trim(),
          count: 0,
          position,
          visible: true,
          ...(color && { color }),
        };
        setParties((prev) => [...prev, newParty]);
        return prevId + 1;
      });
    },
    []
  );

  const deleteParty = useCallback((id) => {
    setParties((prev) => prev.filter((p) => p.id !== id));
    // Also clean up references in parliament
    setParliament((prev) => ({
      ...prev,
      favoredParties: prev.favoredParties.filter((pid) => pid !== id),
      factions: prev.factions.map((f) => ({
        ...f,
        memberPartyIds: f.memberPartyIds.filter((pid) => pid !== id),
      })),
    }));
  }, []);

  // --- Favored parties ---
  const addFavoredParty = useCallback(
    (partyId) => {
      if (!parties.some((p) => p.id === partyId)) return;
      setParliament((prev) => {
        if (prev.favoredParties.includes(partyId)) return prev;
        return { ...prev, favoredParties: [...prev.favoredParties, partyId] };
      });
    },
    [parties]
  );

  const removeFavoredParty = useCallback((partyId) => {
    setParliament((prev) => ({
      ...prev,
      favoredParties: prev.favoredParties.filter((id) => id !== partyId),
    }));
  }, []);

  const getFavoredParties = useCallback(
    () =>
      parliament.favoredParties
        .map((id) => parties.find((p) => p.id === id))
        .filter(Boolean),
    [parliament.favoredParties, parties]
  );

  // --- Factions ---
  const createFaction = useCallback(
    (name, memberPartyIds = []) => {
      if (!name?.trim()) return null;
      const faction = { id: nextFactionId, name: name.trim(), memberPartyIds };
      setParliament((prev) => ({
        ...prev,
        factions: [...prev.factions, faction],
      }));
      setNextFactionId((id) => id + 1);
      return nextFactionId;
    },
    [nextFactionId]
  );

  const deleteFaction = useCallback((factionId) => {
    setParliament((prev) => ({
      ...prev,
      factions: prev.factions.filter((f) => f.id !== factionId),
    }));
  }, []);

  const addPartyToFaction = useCallback((factionId, partyId) => {
    setParliament((prev) => ({
      ...prev,
      factions: prev.factions.map((f) =>
        f.id === factionId && !f.memberPartyIds.includes(partyId)
          ? { ...f, memberPartyIds: [...f.memberPartyIds, partyId] }
          : f
      ),
    }));
  }, []);

  const removePartyFromFaction = useCallback((factionId, partyId) => {
    setParliament((prev) => ({
      ...prev,
      factions: prev.factions.map((f) =>
        f.id === factionId
          ? { ...f, memberPartyIds: f.memberPartyIds.filter((id) => id !== partyId) }
          : f
      ),
    }));
  }, []);

  // --- Count updates (auto-favor when >= threshold) ---
  const updatePartyCount = useCallback(
    (partyId, newCount) => {
      setParties((prev) =>
        prev.map((p) => (p.id === partyId ? { ...p, count: newCount } : p))
      );
      if (newCount >= FAVOR_THRESHOLD) addFavoredParty(partyId);
    },
    [addFavoredParty]
  );

  // --- New party form state ---
  const [newName, setNewName] = useState('');
  const [newPos, setNewPos] = useState('center');
  const [newColor, setNewColor] = useState('#007bff');

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Political Simulator</h2>

      {/* Add party form */}
      <div className="react-demo" style={{ marginBottom: 20 }}>
        <h4>Add Party</h4>
        <div className="button-group" style={{ flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Party name"
            aria-label="Party name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, minWidth: 120 }}
          />
          <select value={newPos} onChange={(e) => setNewPos(e.target.value)} aria-label="Political position" style={{ padding: 8, borderRadius: 4 }}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} aria-label="Party color" />
          <button
            className="react-button"
            onClick={() => {
              addParty(newName, newPos, newColor);
              setNewName('');
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Favored Parties */}
      <h3>Favored Parties</h3>
      {(() => {
        const favored = getFavoredParties();
        return favored.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          No parties above threshold ({FAVOR_THRESHOLD}) yet.
        </p>
      ) : (
        favored.map((party) => (
          <div
            key={party.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: 'var(--content-bg)',
              borderRadius: 6,
              marginBottom: 8,
              border: `2px solid ${party.color || '#007bff'}`,
            }}
          >
            <span>
              <strong>{party.name}</strong> — Favor: {party.count}
            </span>
            <button
              className="react-button reset"
              style={{ padding: '4px 12px', fontSize: '0.85em' }}
              onClick={() => removeFavoredParty(party.id)}
            >
              Remove
            </button>
          </div>
        ))
      );
      })()}

      {/* Party counters */}
      <CounterAppList parties={parties} onCountChange={updatePartyCount} />

      {/* Delete buttons */}
      {parties.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Remove Parties</h4>
          <div className="button-group" style={{ flexWrap: 'wrap' }}>
            {parties.map((p) => (
              <button
                key={p.id}
                className="react-button reset"
                style={{ fontSize: '0.85em', padding: '6px 14px' }}
                onClick={() => deleteParty(p.id)}
              >
                Delete {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
