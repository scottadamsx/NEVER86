import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Printer, CreditCard, ArrowLeft, Users, Split, Share2 } from 'lucide-react';
import { formatDateTime } from '../../utils/timeFormat';

function ServerBillOut() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { tables, orders, closeOrder, clearTable } = useData();
  const [tipAmount, setTipAmount] = useState('');
  const [selectedTipPercent, setSelectedTipPercent] = useState(null);
  const [billMode, setBillMode] = useState('single'); // 'single', 'byGuest', 'split', 'spread'
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [itemsToSpread, setItemsToSpread] = useState([]);

  const table = tables.find(t => t.id === tableId);
  const order = orders.find(o => o.tableId === tableId && o.status === 'active');

  if (!table || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Order not found</p>
        <button
          onClick={() => navigate('/server/tables')}
          className="mt-4 text-server-primary hover:underline"
        >
          Back to My Tables
        </button>
      </div>
    );
  }

  // Calculate bills based on mode
  const bills = useMemo(() => {
    if (billMode === 'single') {
      const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
      const tax = subtotal * 0.08;
      return [{ guests: Array.from({ length: table.guestCount }, (_, i) => i + 1), items: order.items, subtotal, tax, total: subtotal + tax }];
    } else if (billMode === 'byGuest') {
      return Array.from({ length: table.guestCount }, (_, i) => {
        const guestNum = i + 1;
        const guestItems = order.items.filter(item => item.guestNumber === guestNum);
        const subtotal = guestItems.reduce((sum, item) => sum + item.price, 0);
        const tax = subtotal * 0.08;
        return { guests: [guestNum], items: guestItems, subtotal, tax, total: subtotal + tax };
      });
    } else if (billMode === 'split') {
      if (selectedGuests.length === 0) return [];
      const splitItems = order.items.filter(item => selectedGuests.includes(item.guestNumber));
      const subtotal = splitItems.reduce((sum, item) => sum + item.price, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;
      const perGuest = total / selectedGuests.length;
      return [{ guests: selectedGuests, items: splitItems, subtotal, tax, total, perGuest }];
    } else if (billMode === 'spread') {
      const spreadItems = order.items.filter(item => itemsToSpread.includes(item.id));
      const otherItems = order.items.filter(item => !itemsToSpread.includes(item.id));
      
      const spreadSubtotal = spreadItems.reduce((sum, item) => sum + item.price, 0);
      const spreadPerGuest = spreadSubtotal / table.guestCount;
      
      const bills = Array.from({ length: table.guestCount }, (_, i) => {
        const guestNum = i + 1;
        const guestItems = otherItems.filter(item => item.guestNumber === guestNum);
        const guestSubtotal = guestItems.reduce((sum, item) => sum + item.price, 0) + spreadPerGuest;
        const tax = guestSubtotal * 0.08;
        return {
          guests: [guestNum],
          items: [...guestItems, ...spreadItems.map(item => ({ ...item, spread: true }))],
          subtotal: guestSubtotal,
          tax,
          total: guestSubtotal + tax,
          spreadAmount: spreadPerGuest
        };
      });
      return bills;
    }
    return [];
  }, [billMode, order.items, table.guestCount, selectedGuests, itemsToSpread]);

  const total = bills.reduce((sum, bill) => sum + bill.total, 0);
  const subtotal = bills.reduce((sum, bill) => sum + bill.subtotal, 0);
  const tax = bills.reduce((sum, bill) => sum + bill.tax, 0);

  const tipSuggestions = useMemo(() => {
    const grandTotal = total;
    return [
      { percent: 15, amount: grandTotal * 0.15 },
      { percent: 18, amount: grandTotal * 0.18 },
      { percent: 20, amount: grandTotal * 0.20 },
    ];
  }, [total]);

  const handleTipSelect = (percent, amount) => {
    setSelectedTipPercent(percent);
    setTipAmount(amount.toFixed(2));
  };

  const handlePayAndClose = () => {
    const tip = parseFloat(tipAmount) || 0;
    closeOrder(order.id, tip);
    clearTable(tableId);
    navigate('/server/tables');
  };

  const currentDate = formatDateTime(new Date());

  return (
    <div>
      <button
        onClick={() => navigate('/server/tables')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Back to My Tables
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bill Out - Table {table.number}</h1>
      </div>

      {/* Bill Mode Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bill Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => {
              setBillMode('single');
              setSelectedGuests([]);
              setItemsToSpread([]);
            }}
            className={`p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              billMode === 'single'
                ? 'bg-server-primary text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <CreditCard size={18} />
            Single Bill
          </button>
          <button
            onClick={() => {
              setBillMode('byGuest');
              setSelectedGuests([]);
              setItemsToSpread([]);
            }}
            className={`p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              billMode === 'byGuest'
                ? 'bg-server-primary text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <Users size={18} />
            By Guest
          </button>
          <button
            onClick={() => {
              setBillMode('split');
              setItemsToSpread([]);
            }}
            className={`p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              billMode === 'split'
                ? 'bg-server-primary text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <Split size={18} />
            Split Bill
          </button>
          <button
            onClick={() => {
              setBillMode('spread');
              setSelectedGuests([]);
            }}
            className={`p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              billMode === 'spread'
                ? 'bg-server-primary text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <Share2 size={18} />
            Spread Items
          </button>
        </div>

        {/* Split Bill Guest Selection */}
        {billMode === 'split' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select guests to split between:</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: table.guestCount }, (_, i) => i + 1).map(guestNum => (
                <button
                  key={guestNum}
                  onClick={() => {
                    setSelectedGuests(prev =>
                      prev.includes(guestNum)
                        ? prev.filter(g => g !== guestNum)
                        : [...prev, guestNum]
                    );
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedGuests.includes(guestNum)
                      ? 'bg-server-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Guest {guestNum}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spread Items Selection */}
        {billMode === 'spread' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select items to spread across all guests:</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {order.items.map(item => (
                <label key={item.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemsToSpread.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setItemsToSpread(prev => [...prev, item.id]);
                      } else {
                        setItemsToSpread(prev => prev.filter(id => id !== item.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.name} - ${item.price.toFixed(2)} (Guest {item.guestNumber})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receipt(s) */}
        <div className="space-y-4">
          {bills.map((bill, billIndex) => (
            <div key={billIndex} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg p-6">
                {/* Receipt Header */}
                <div className="text-center mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Never86 Restaurant</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">123 Main Street</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Table {table.number} • {bill.guests.length === 1 ? `Guest ${bill.guests[0]}` : `Guests ${bill.guests.join(', ')}`} • Server: You
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</p>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                  {bill.items.map((item, itemIndex) => (
                    <div key={item.id || itemIndex} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.name}
                        {item.modifications && <span className="text-gray-500"> ({item.modifications})</span>}
                        {item.spread && <span className="text-blue-600 dark:text-blue-400 text-xs ml-1">(shared)</span>}
                        {!item.spread && bill.guests.length === 1 && <span className="text-gray-500 text-xs ml-1">(Guest {item.guestNumber})</span>}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {item.spread && bill.spreadAmount ? `$${bill.spreadAmount.toFixed(2)}` : `$${item.price.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  {bill.spreadAmount && (
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span>Shared items portion</span>
                      <span>${bill.spreadAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">${bill.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Tax (8%)</span>
                    <span className="text-gray-900 dark:text-white">${bill.tax.toFixed(2)}</span>
                  </div>
                  {bill.perGuest && (
                    <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400 pt-2 border-t border-gray-200 dark:border-slate-700">
                      <span>Per Guest ({bill.guests.length} guests)</span>
                      <span>${bill.perGuest.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-slate-700">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">${bill.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Suggested Tips */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Suggested Tips:</p>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    {[15, 18, 20].map(percent => (
                      <span key={percent}>{percent}%: ${(bill.total * percent / 100).toFixed(2)}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Options */}
        <div className="space-y-6">
          {/* Tip Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tip Amount</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {tipSuggestions.map(tip => (
                <button
                  key={tip.percent}
                  onClick={() => handleTipSelect(tip.percent, tip.amount)}
                  className={`p-3 rounded-lg font-medium transition-colors ${
                    selectedTipPercent === tip.percent
                      ? 'bg-server-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tip.percent}%
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Custom Amount</label>
              <input
                type="number"
                step="0.01"
                value={tipAmount}
                onChange={(e) => {
                  setTipAmount(e.target.value);
                  setSelectedTipPercent(null);
                }}
                placeholder="0.00"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Grand Total */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-gray-200 dark:border-slate-700">
                <span className="text-gray-900 dark:text-white">Grand Total</span>
                <span className="text-gray-900 dark:text-white">
                  ${(total + (parseFloat(tipAmount) || 0)).toFixed(2)}
                </span>
              </div>
              {bills.length > 1 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                  {bills.length} separate {bills.length === 1 ? 'bill' : 'bills'}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center gap-2">
              <Printer size={20} />
              Print Receipt
            </button>
            <button
              onClick={handlePayAndClose}
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              Pay & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerBillOut;