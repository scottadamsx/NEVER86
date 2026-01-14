import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { X, Clock, DollarSign, Users, History, Upload, Sparkles, Edit, Calendar, Lock } from 'lucide-react';
import { formatTimeElapsed, formatTime, formatDateTime } from '../../utils/timeFormat';

function ManagerFloor() {
  const { tables, getTableHistory, getOrderByTable, orders, staff, updateTable } = useData();
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState('current'); // 'current' or 'history'
  const [showFloorPlanGenerator, setShowFloorPlanGenerator] = useState(false);
  const [showPartyConfig, setShowPartyConfig] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectedTables, setDetectedTables] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [partyConfig, setPartyConfig] = useState({
    tableIds: [],
    startTime: '',
    endTime: '',
    maxGuests: '',
    notes: ''
  });

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-500 text-green-700';
      case 'occupied': return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'reserved': return 'bg-gray-100 border-gray-500 text-gray-700';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getTimeElapsed = (seatedAt) => {
    return formatTimeElapsed(seatedAt, currentTime);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Floor Plan</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPartyConfig(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar size={18} />
            Party Config
          </button>
          <button
            onClick={() => setShowFloorPlanGenerator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Sparkles size={18} />
            AI Floor Plan Generator
          </button>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-300">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-300">Reserved</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Floor Plan Generator Modal */}
      {showFloorPlanGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-purple-600" size={24} />
                AI Floor Plan Generator
              </h2>
              <button
                onClick={() => {
                  setShowFloorPlanGenerator(false);
                  setUploadedImage(null);
                  setDetectedTables([]);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Floor Plan Image
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded floor plan"
                        className="max-w-full max-h-96 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setDetectedTables([]);
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                      <label className="cursor-pointer">
                        <span className="text-server-primary hover:underline">Click to upload</span> or drag and drop
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setUploadedImage(event.target?.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {uploadedImage && (
                <div>
                  <button
                    onClick={() => {
                      setIsProcessing(true);
                      // Simulate AI processing (in real app, this would call an API)
                      setTimeout(() => {
                        // Mock table detection - in real app, this would come from AI
                        const mockDetected = [
                          { id: 'detected-1', x: 100, y: 150, width: 80, height: 80, number: 1 },
                          { id: 'detected-2', x: 250, y: 150, width: 80, height: 80, number: 2 },
                          { id: 'detected-3', x: 400, y: 150, width: 80, height: 80, number: 3 },
                          { id: 'detected-4', x: 100, y: 300, width: 80, height: 80, number: 4 },
                          { id: 'detected-5', x: 250, y: 300, width: 80, height: 80, number: 5 },
                        ];
                        setDetectedTables(mockDetected);
                        setIsProcessing(false);
                      }, 2000);
                    }}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing Image...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Detect Tables
                      </>
                    )}
                  </button>
                </div>
              )}

              {detectedTables.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-300 font-medium mb-2">
                    ✓ Detected {detectedTables.length} tables
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Tables have been identified in your floor plan. You can now configure them in the floor plan view.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setShowFloorPlanGenerator(false);
                    setUploadedImage(null);
                    setDetectedTables([]);
                  }}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Party Configuration Modal */}
      {showPartyConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={24} />
                Custom Party Configuration
              </h2>
              <button
                onClick={() => {
                  setShowPartyConfig(false);
                  setPartyConfig({ tableIds: [], startTime: '', endTime: '', maxGuests: '', notes: '' });
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Tables (Hold Ctrl/Cmd to select multiple)
                </label>
                <select
                  multiple
                  value={partyConfig.tableIds}
                  onChange={(e) => setPartyConfig({ ...partyConfig, tableIds: Array.from(e.target.selectedOptions, option => option.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white h-32"
                  aria-label="Select tables for party configuration"
                >
                  {tables.filter(t => t.status === 'available' || partyConfig.tableIds.includes(t.id)).map(table => (
                    <option key={table.id} value={table.id}>
                      Table {table.number} ({table.seats} seats) - {table.status}
                    </option>
                  ))}
                </select>
                {partyConfig.tableIds.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {partyConfig.tableIds.length} table(s) selected
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Block Seating From
                  </label>
                  <input
                    type="time"
                    value={partyConfig.startTime}
                    onChange={(e) => setPartyConfig({ ...partyConfig, startTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Until
                  </label>
                  <input
                    type="time"
                    value={partyConfig.endTime}
                    onChange={(e) => setPartyConfig({ ...partyConfig, endTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Guests (Optional)
                </label>
                <input
                  type="number"
                  value={partyConfig.maxGuests}
                  onChange={(e) => setPartyConfig({ ...partyConfig, maxGuests: e.target.value })}
                  placeholder="Leave empty for no limit"
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={partyConfig.notes}
                  onChange={(e) => setPartyConfig({ ...partyConfig, notes: e.target.value })}
                  placeholder="Special instructions or party details..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <Lock size={16} className="inline mr-2" />
                  This configuration will prevent seating during the specified time period and sync across all portals.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setShowPartyConfig(false);
                    setPartyConfig({ tableIds: [], startTime: '', endTime: '', maxGuests: '', notes: '' });
                  }}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (partyConfig.tableIds.length === 0) {
                      alert('Please select at least one table.');
                      return;
                    }
                    if (!partyConfig.startTime || !partyConfig.endTime) {
                      alert('Please specify both start and end times.');
                      return;
                    }
                    
                    // Update each selected table
                    partyConfig.tableIds.forEach(tableId => {
                      updateTable(tableId, {
                        status: 'reserved',
                        reservedUntil: partyConfig.endTime,
                        reservedFrom: partyConfig.startTime,
                        partyNotes: partyConfig.notes,
                        maxGuests: partyConfig.maxGuests ? parseInt(partyConfig.maxGuests) : null
                      });
                    });
                    
                    setShowPartyConfig(false);
                    setPartyConfig({ tableIds: [], startTime: '', endTime: '', maxGuests: '', notes: '' });
                  }}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floor Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-5 gap-4">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${getStatusColor(table.status)}`}
            >
              <div className="text-2xl font-bold">{table.number}</div>
              <div className="text-sm opacity-75">{table.seats} seats</div>
              {table.status === 'occupied' && (
                <div className="text-xs mt-1">{getTimeElapsed(table.seatedAt)}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table Modal */}
      {selectedTable && (() => {
        const history = getTableHistory(selectedTable.id);
        const currentOrder = getOrderByTable(selectedTable.id);
        const currentOrderTotal = currentOrder
          ? currentOrder.items.reduce((sum, item) => sum + item.price, 0)
          : 0;

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Table {selectedTable.number}
                </h2>
                <button
                  onClick={() => {
                    setSelectedTable(null);
                    setViewMode('current');
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* View Mode Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setViewMode('current')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'current'
                      ? 'bg-brand-navy text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Current Status
                </button>
                <button
                  onClick={() => setViewMode('history')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    viewMode === 'history'
                      ? 'bg-brand-navy text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <History size={16} />
                  History ({history.length})
                </button>
              </div>

              {/* Current Status View */}
              {viewMode === 'current' && (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedTable.status}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400">Seats</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedTable.seats}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400">Section</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedTable.section}</span>
                  </div>
                  {selectedTable.status === 'occupied' && (
                    <>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-gray-400">Guests</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedTable.guestCount}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-gray-400">Time Seated</span>
                        <span className="font-medium text-gray-900 dark:text-white">{getTimeElapsed(selectedTable.seatedAt)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                        <span className="text-gray-500 dark:text-gray-400">Current Bill</span>
                        <span className="font-semibold text-gray-900 dark:text-white">${currentOrderTotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* History View */}
              {viewMode === 'history' && (
                <div className="space-y-3">
                  {history.length > 0 ? (
                    history.slice().reverse().map(record => {
                      const server = staff.find(s => s.id === record.serverId);
                      return (
                        <div key={record.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDateTime(record.seatedAt)}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                Server: {server?.displayName || 'Unknown'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">${record.totalSales.toFixed(2)}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">+${record.tip.toFixed(2)} tip</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">{record.guestCount} guests</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">{record.totalPartyTime} min total</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-blue-500" />
                              <span className="text-gray-700 dark:text-gray-300">{record.timeToOrder} min to order</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-orange-500" />
                              <span className="text-gray-700 dark:text-gray-300">{Math.round(record.avgOrderRunTime)} min food prep</span>
                            </div>
                          </div>

                          {record.chits.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Order Chits ({record.chits.length})</p>
                              <div className="space-y-1">
                                {record.chits.map((chit, idx) => (
                                  <div key={chit.id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span>Chit #{idx + 1}</span>
                                    <span>{chit.runTime !== null ? `${chit.runTime} min` : 'N/A'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <History className="mx-auto text-gray-300 dark:text-slate-600 mb-3" size={48} />
                      <p className="text-gray-500 dark:text-gray-400">No history for this table yet</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedTable(null);
                    setViewMode('current');
                  }}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default ManagerFloor;