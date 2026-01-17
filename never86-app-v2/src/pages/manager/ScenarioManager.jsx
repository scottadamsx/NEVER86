/**
 * SCENARIO MANAGER PAGE
 * 
 * Data Lab interface for managing test scenarios:
 * - View current application state
 * - Upload CSV files to create scenarios
 * - Save/load/delete scenarios
 * - Switch between scenarios
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  Eye, 
  X, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useScenario } from '../../context/ScenarioContext';
import { useToast } from '../../context/ToastContext';
import { parseMultipleCSVs, downloadCSV } from '../../utils/csvParser';
import CSVViewer from '../../components/CSVViewer';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const DATA_TYPES = [
  { key: 'staff', label: 'Staff', icon: '👥' },
  { key: 'table', label: 'Tables', icon: '🪑' },
  { key: 'menuItem', label: 'Menu Items', icon: '📋' },
  { key: 'inventory', label: 'Inventory', icon: '📦' },
  { key: 'order', label: 'Orders', icon: '🧾' }
];

export default function ScenarioManager() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const { 
    tables, 
    menuItems, 
    inventory, 
    staff, 
    orders, 
    chits,
    loadScenarioData 
  } = useData();
  const { 
    scenarios, 
    currentScenario, 
    saveScenario, 
    loadScenario, 
    deleteScenario, 
    exportScenario 
  } = useScenario();

  // UI State
  const [activeTab, setActiveTab] = useState('view'); // 'view', 'upload', 'scenarios'
  const [viewingDataType, setViewingDataType] = useState('staff');
  const [showViewer, setShowViewer] = useState(false);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);
  const [scenarioToLoad, setScenarioToLoad] = useState(null);
  const [scenarioToDelete, setScenarioToDelete] = useState(null);

  // Upload State
  const [uploadFiles, setUploadFiles] = useState({});
  const [scenarioName, setScenarioName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadWarnings, setUploadWarnings] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Get data count for a specific type
  const getDataCount = (dataType) => {
    switch (dataType) {
      case 'staff': return staff?.length || 0;
      case 'table': return tables?.length || 0;
      case 'menuItem': return menuItems?.length || 0;
      case 'inventory': return inventory?.length || 0;
      case 'order': return orders?.length || 0;
      default: return 0;
    }
  };

  // Get current data for viewing
  const getCurrentData = () => {
    switch (viewingDataType) {
      case 'staff': return staff || [];
      case 'table': return tables || [];
      case 'menuItem': return menuItems || [];
      case 'inventory': return inventory || [];
      case 'order': return orders || [];
      default: return [];
    }
  };

  // Handle file selection
  const handleFileSelect = (dataType, file) => {
    if (!file) return;
    
    setUploadFiles(prev => ({
      ...prev,
      [dataType]: file
    }));
  };

  // Handle CSV upload and scenario creation
  const handleUpload = async () => {
    if (!scenarioName || !restaurantName) {
      showError('Please provide scenario name and restaurant name');
      return;
    }

    if (Object.keys(uploadFiles).length === 0) {
      showError('Please select at least one CSV file');
      return;
    }

    setIsUploading(true);
    setUploadErrors([]);
    setUploadWarnings([]);

    try {
      // Parse all CSV files
      const result = await parseMultipleCSVs(uploadFiles);

      if (result.errors.length > 0) {
        setUploadErrors(result.errors);
        showError(`Found ${result.errors.length} errors. Please check and fix.`);
        setIsUploading(false);
        return;
      }

      if (result.warnings.length > 0) {
        setUploadWarnings(result.warnings);
      }

      // Transform data to match DataContext structure
      const scenarioData = {
        tables: result.data.table || [],
        menuItems: result.data.menuItem || [],
        inventory: result.data.inventory || [],
        staff: result.data.staff || [],
        orders: result.data.order || [],
        chits: [], // Chits will be generated from orders if needed
        messages: []
      };

      // Save scenario
      const scenarioId = saveScenario({
        scenarioName,
        restaurantName,
        description,
        data: scenarioData
      });

      success(`Scenario "${scenarioName}" saved successfully!`);
      
      // Reset form
      setScenarioName('');
      setRestaurantName('');
      setDescription('');
      setUploadFiles({});
      setActiveTab('scenarios');
    } catch (error) {
      console.error('Upload error:', error);
      showError(`Failed to upload scenario: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle scenario load
  const handleLoadScenario = async (scenarioId) => {
    try {
      const scenario = loadScenario(scenarioId);
      
      // Load data into DataContext
      if (loadScenarioData) {
        await loadScenarioData(scenario.data);
        success(`Scenario "${scenario.scenarioName}" loaded successfully!`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showError('Data loading not available. Please refresh the page.');
      }
    } catch (error) {
      console.error('Load error:', error);
      showError(`Failed to load scenario: ${error.message}`);
    }
  };

  // Handle scenario delete
  const handleDeleteScenario = (scenarioId) => {
    deleteScenario(scenarioId);
    success('Scenario deleted successfully');
    setScenarioToDelete(null);
  };

  // Handle scenario export
  const handleExportScenario = async (scenarioId) => {
    try {
      const scenario = exportScenario(scenarioId);
      const dataStr = JSON.stringify(scenario, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${scenario.scenarioName.replace(/\s+/g, '-')}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      success('Scenario exported successfully');
    } catch (error) {
      showError(`Failed to export scenario: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Data Lab
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage test scenarios and view application state
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/manager/settings')}>
          <X className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'view'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          View Current State
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'upload'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload Scenario
        </button>
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'scenarios'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Saved Scenarios ({scenarios.length})
        </button>
      </div>

      {/* View Current State Tab */}
      {activeTab === 'view' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>View Current Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {DATA_TYPES.map(type => (
                  <button
                    key={type.key}
                    onClick={() => {
                      setViewingDataType(type.key);
                      setShowViewer(true);
                    }}
                    className="p-4 border rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {getDataCount(type.key)} items
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {showViewer && (
            <CSVViewer
              data={getCurrentData()}
              title={`${DATA_TYPES.find(t => t.key === viewingDataType)?.label} Data`}
              onClose={() => setShowViewer(false)}
              exportFilename={`${viewingDataType}-${new Date().toISOString().split('T')[0]}.csv`}
            />
          )}
        </div>
      )}

      {/* Upload Scenario Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV Scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Scenario Name *</label>
                <Input
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g., Busy Friday Night"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Restaurant Name *</label>
                <Input
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g., The Golden Fork"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this scenario tests..."
                  className="w-full px-3 py-2 border rounded-lg min-h-[80px]"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSV Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {DATA_TYPES.map(type => (
                <div key={type.key} className="flex items-center gap-4">
                  <div className="w-32">
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {uploadFiles[type.key]?.name || 'Select CSV file'}
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileSelect(type.key, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploadFiles[type.key] && (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" />
                      Selected
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Errors and Warnings */}
          {uploadErrors.length > 0 && (
            <Card className="border-red-200 dark:border-red-900/30">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Errors ({uploadErrors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-red-600 dark:text-red-400 max-h-60 overflow-y-auto">
                  {uploadErrors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {uploadWarnings.length > 0 && (
            <Card className="border-yellow-200 dark:border-yellow-900/30">
              <CardHeader>
                <CardTitle className="text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Warnings ({uploadWarnings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-yellow-600 dark:text-yellow-400 max-h-60 overflow-y-auto">
                  {uploadWarnings.map((warning, idx) => (
                    <li key={idx}>• {warning}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading || !scenarioName || !restaurantName}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isUploading ? 'Uploading...' : 'Upload and Save Scenario'}
          </Button>
        </div>
      )}

      {/* Saved Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          {scenarios.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No saved scenarios yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload CSV files to create your first scenario
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {scenarios.map(scenario => (
                <Card key={scenario.id} className={currentScenario?.id === scenario.id ? 'border-purple-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{scenario.scenarioName}</h3>
                          {currentScenario?.id === scenario.id && (
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Restaurant: {scenario.restaurantName}
                        </p>
                        {scenario.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {scenario.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(scenario.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setScenarioToLoad(scenario.id);
                            setShowLoadConfirm(true);
                          }}
                          disabled={currentScenario?.id === scenario.id}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Load
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportScenario(scenario.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setScenarioToDelete(scenario.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Load Confirmation */}
      <ConfirmationDialog
        isOpen={showLoadConfirm}
        onClose={() => {
          setShowLoadConfirm(false);
          setScenarioToLoad(null);
        }}
        onConfirm={() => {
          if (scenarioToLoad) {
            handleLoadScenario(scenarioToLoad);
            setShowLoadConfirm(false);
            setScenarioToLoad(null);
          }
        }}
        title="Load Scenario"
        message="Loading this scenario will replace all current data. This action cannot be undone. Continue?"
        confirmText="Load Scenario"
        variant="danger"
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!scenarioToDelete}
        onClose={() => setScenarioToDelete(null)}
        onConfirm={() => {
          if (scenarioToDelete) {
            handleDeleteScenario(scenarioToDelete);
          }
        }}
        title="Delete Scenario"
        message="Are you sure you want to delete this scenario? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
