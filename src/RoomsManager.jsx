import { useState } from 'react';
import './RoomsManager.css';

export default function RoomsManager({ cpus, setCpus, rooms, setRooms, history, setHistory, updateData }) {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0] || null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState(24);

  const getStartingPaNumber = (roomId) => {
    let count = 1;
    for (let r of rooms) {
      if (r.id === roomId) break;
      count += r.capacity;
    }
    return count;
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return alert("O nome da sala é obrigatório.");
    if (rooms.some(r => r.name.toLowerCase() === newRoomName.toLowerCase())) {
      return alert("Já existe uma sala com este nome.");
    }
    
    const newRoom = {
      id: Date.now(),
      name: newRoomName,
      capacity: Number(newRoomCapacity),
      paStatus: []
    };

    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    updateData({ rooms: updatedRooms });
    setSelectedRoom(newRoom);
    
    setNewRoomName('');
    setNewRoomCapacity(24);
    setIsAddingRoom(false);
  };

  const handleDeleteRoom = () => {
    if (!selectedRoom) return;
    if (selectedRoom.paStatus.length > 0) {
      return alert("Você não pode excluir uma sala que contém CPUs. Remova as máquinas primeiro.");
    }
    if (confirm(`Tem certeza que deseja excluir a sala "${selectedRoom.name}"?`)) {
      const updatedRooms = rooms.filter(r => r.id !== selectedRoom.id);
      setRooms(updatedRooms);
      updateData({ rooms: updatedRooms });
      setSelectedRoom(updatedRooms[0] || null);
    }
  };

  const addPa = () => {
    if (!selectedRoom) return;
    const newRooms = rooms.map(r => {
      if (r.id === selectedRoom.id) {
        return { ...r, capacity: r.capacity + 1 };
      }
      return r;
    });
    setRooms(newRooms);
    updateData({ rooms: newRooms });
    setSelectedRoom(newRooms.find(r => r.id === selectedRoom.id));
  };

  const removePa = () => {
    if (!selectedRoom) return;
    if (selectedRoom.capacity <= 1) return;
    
    // Check if the last PA is occupied
    const isOccupied = selectedRoom.paStatus.some(p => p.index === selectedRoom.capacity - 1);
    if (isOccupied) {
      alert("A última PA está ocupada. Mova a CPU antes de remover a PA.");
      return;
    }

    const newRooms = rooms.map(r => {
      if (r.id === selectedRoom.id) {
        return { ...r, capacity: r.capacity - 1 };
      }
      return r;
    });
    setRooms(newRooms);
    updateData({ rooms: newRooms });
    setSelectedRoom(newRooms.find(r => r.id === selectedRoom.id));
  };

  const handleCpuDrop = (cpuId, paIndex) => {
    const cpu = cpus.find(c => c.id === cpuId);
    if (!cpu || !selectedRoom) return;

    // Check if PA is already occupied
    if (selectedRoom.paStatus.some(p => p.index === paIndex)) {
      alert("PA já está ocupada!");
      return;
    }

    const globalPaNumber = getStartingPaNumber(selectedRoom.id) + paIndex;
    const oldLocation = cpu.location;
    const newLocation = `${selectedRoom.name} - PA ${String(globalPaNumber).padStart(2, '0')}`;

    // Update CPU location
    const newCpus = cpus.map(c => c.id === cpuId ? { ...c, location: newLocation } : c);
    
    // Update Rooms
    let newRooms = [...rooms];
    
    // Remove from old room if applicable
    if (oldLocation !== 'estoque') {
       newRooms = newRooms.map(r => ({
           ...r,
           paStatus: r.paStatus.filter(p => p.cpuId !== cpuId)
       }));
    }

    // Add to new room
    newRooms = newRooms.map(r => {
       if (r.id === selectedRoom.id) {
           return { ...r, paStatus: [...r.paStatus, { index: paIndex, cpuId }] };
       }
       return r;
    });

    // Create History entry
    const newHistoryEntry = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      cpuCode: cpu.code,
      from: oldLocation,
      to: newLocation
    };
    const newHistoryList = [newHistoryEntry, ...history];

    setCpus(newCpus);
    setRooms(newRooms);
    setHistory(newHistoryList);
    setSelectedRoom(newRooms.find(r => r.id === selectedRoom.id));
    
    updateData({ cpus: newCpus, rooms: newRooms, history: newHistoryList });
  };

  const handleRemoveCpuFromPa = (cpuId) => {
    const cpu = cpus.find(c => c.id === cpuId);
    if (!cpu || !selectedRoom) return;

    const oldLocation = cpu.location;
    const newLocation = 'estoque';

    const newCpus = cpus.map(c => c.id === cpuId ? { ...c, location: newLocation } : c);
    
    const newRooms = rooms.map(r => ({
        ...r,
        paStatus: r.paStatus.filter(p => p.cpuId !== cpuId)
    }));

    const newHistoryEntry = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      cpuCode: cpu.code,
      from: oldLocation,
      to: newLocation
    };
    const newHistoryList = [newHistoryEntry, ...history];

    setCpus(newCpus);
    setRooms(newRooms);
    setHistory(newHistoryList);
    setSelectedRoom(newRooms.find(r => r.id === selectedRoom.id));
    
    updateData({ cpus: newCpus, rooms: newRooms, history: newHistoryList });
  };

  const handleDragStart = (e, cpuId) => {
    e.dataTransfer.setData("cpuId", cpuId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, paIndex) => {
    const cpuId = parseInt(e.dataTransfer.getData("cpuId"));
    handleCpuDrop(cpuId, paIndex);
  };

  return (
    <div className="rooms-manager flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2>Gestão de Salas</h2>
        <div className="flex gap-2 flex-wrap">
          {rooms.map(r => (
            <button 
              key={r.id} 
              className={selectedRoom?.id === r.id ? 'primary btn-glow' : ''}
              onClick={() => setSelectedRoom(r)}
              style={selectedRoom?.id !== r.id ? {background: 'var(--input-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)'} : {}}
            >
              {r.name}
            </button>
          ))}
          <button 
            onClick={() => setIsAddingRoom(true)} 
            style={{background: 'transparent', color: 'var(--primary-color)', border: '1px dashed var(--primary-color)'}}
          >
            + Nova Sala
          </button>
        </div>
      </div>

      {isAddingRoom && (
        <div className="card mb-4">
          <h3 className="mb-4">Adicionar Nova Sala</h3>
          <form onSubmit={handleAddRoom} className="flex gap-4 flex-wrap items-end">
            <div className="input-group" style={{flex: 2}}>
              <label>Nome da Sala</label>
              <input required type="text" className="premium-input" placeholder="Ex: Sala 3" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} />
            </div>
            <div className="input-group" style={{flex: 1}}>
              <label>Quantidade de PAs Iniciais</label>
              <input required type="number" min="1" max="100" className="premium-input" value={newRoomCapacity} onChange={e => setNewRoomCapacity(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsAddingRoom(false)} style={{background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)'}}>Cancelar</button>
              <button type="submit" className="primary btn-glow">Salvar Sala</button>
            </div>
          </form>
        </div>
      )}

      {selectedRoom && (
        <div className="card room-view">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h3>{selectedRoom.name} - ({selectedRoom.capacity} PAs)</h3>
              <button onClick={handleDeleteRoom} className="btn-sm" style={{background: 'transparent', color: '#ef4444', border: '1px dashed #ef4444'}}>Excluir Sala</button>
            </div>
            <div className="flex gap-2">
              <button onClick={addPa} className="btn-sm" style={{border: '1px solid var(--border-color)'}}>+ Adicionar PA</button>
              <button onClick={removePa} className="btn-sm btn-danger">- Remover PA</button>
            </div>
          </div>

          <div className="pa-grid">
            {Array.from({ length: selectedRoom.capacity }).map((_, i) => {
              const occupancy = selectedRoom.paStatus.find(p => p.index === i);
              const cpuInfo = occupancy ? cpus.find(c => c.id === occupancy.cpuId) : null;
              const globalPaNumber = getStartingPaNumber(selectedRoom.id) + i;
              
              return (
                <div 
                  key={i} 
                  className={`pa-slot ${occupancy ? 'occupied' : 'free'}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, i)}
                  style={{ position: 'relative' }}
                >
                  <div className="pa-title">PA {String(globalPaNumber).padStart(2, '0')}</div>
                  {cpuInfo ? (
                    <>
                      <div 
                        className="cpu-drag-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, cpuInfo.id)}
                      >
                        {cpuInfo.code}
                      </div>
                      <button 
                        onClick={() => handleRemoveCpuFromPa(cpuInfo.id)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: '2px solid var(--surface-color)',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          lineHeight: 1,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          backdropFilter: 'blur(4px)',
                          zIndex: 10
                        }}
                        title="Devolver ao Estoque"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="pa-empty-text">Vazio</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card mt-4">
        <h3>CPUs Disponíveis no Estoque</h3>
        <p className="text-muted mb-2 text-sm">Arraste uma CPU para uma PA vazia.</p>
        <div className="flex gap-2" style={{flexWrap: 'wrap'}}>
          {cpus.filter(c => c.location === 'estoque').map(cpu => (
            <div 
              key={cpu.id} 
              className="cpu-drag-item badge"
              draggable
              onDragStart={(e) => handleDragStart(e, cpu.id)}
            >
              {cpu.code} ({cpu.acquisition})
            </div>
          ))}
          {cpus.filter(c => c.location === 'estoque').length === 0 && (
            <span className="text-muted">O estoque está vazio.</span>
          )}
        </div>
      </div>
    </div>
  );
}
