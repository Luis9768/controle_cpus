import * as XLSX from 'xlsx';
import './History.css';

export default function History({ history, setHistory, updateData }) {

  const handleExport = () => {
    if (history.length === 0) return alert('Não há histórico para exportar.');
    
    const dataToExport = history.map(entry => ({
      'Data/Hora': entry.date,
      'CPU': entry.cpuCode,
      'Origem': entry.from,
      'Destino': entry.to
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico");

    XLSX.writeFile(workbook, "Historico_Movimentacoes_CPUs.xlsx");
  };

  return (
    <div className="history-manager">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Histórico de Movimentações</h2>
          <p className="text-muted">Veja o registro de todas as alterações de localidade das CPUs.</p>
        </div>
        <div>
          <button onClick={handleExport} className="primary badge" style={{padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: 'none'}}>
            Exportar Excel
          </button>
        </div>
      </div>
      
      <div className="card">
        <table className="history-table w-full">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>CPU</th>
              <th>Origem</th>
              <th>Destino</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td><strong>{entry.cpuCode}</strong></td>
                  <td><span className="badge badge-outline">{entry.from}</span></td>
                  <td><span className="badge badge-outline">{entry.to}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted" style={{padding: '2rem'}}>
                  Nenhuma movimentação registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
