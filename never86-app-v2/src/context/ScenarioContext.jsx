/**
 * SCENARIO CONTEXT
 * 
 * Manages scenario data, restaurant name, and scenario switching.
 * Scenarios are saved test data sets that can completely replace app state.
 */

import { createContext, useContext, useState, useEffect } from 'react';

export const ScenarioContext = createContext();

/**
 * ScenarioProvider Component
 * 
 * Provides scenario management functionality:
 * - Current scenario metadata
 * - Restaurant name display
 * - Scenario save/load/delete
 * - Scenario list management
 */
export function ScenarioProvider({ children }) {
  // Current scenario metadata
  const [currentScenario, setCurrentScenario] = useState(() => {
    try {
      const saved = localStorage.getItem('never86_currentScenario');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Restaurant name (from current scenario or default)
  const [restaurantName, setRestaurantName] = useState(() => {
    try {
      const saved = localStorage.getItem('never86_restaurantName');
      return saved || null;
    } catch {
      return null;
    }
  });

  // List of saved scenarios
  const [scenarios, setScenarios] = useState(() => {
    try {
      const saved = localStorage.getItem('never86_scenarios');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save scenarios list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('never86_scenarios', JSON.stringify(scenarios));
    } catch (error) {
      console.error('Error saving scenarios:', error);
    }
  }, [scenarios]);

  // Save current scenario to localStorage
  useEffect(() => {
    try {
      if (currentScenario) {
        localStorage.setItem('never86_currentScenario', JSON.stringify(currentScenario));
      } else {
        localStorage.removeItem('never86_currentScenario');
      }
    } catch (error) {
      console.error('Error saving current scenario:', error);
    }
  }, [currentScenario]);

  // Save restaurant name to localStorage
  useEffect(() => {
    try {
      if (restaurantName) {
        localStorage.setItem('never86_restaurantName', restaurantName);
      } else {
        localStorage.removeItem('never86_restaurantName');
      }
    } catch (error) {
      console.error('Error saving restaurant name:', error);
    }
  }, [restaurantName]);

  /**
   * Save a new scenario
   * 
   * @param {Object} scenarioData - Scenario metadata and data
   * @param {string} scenarioData.scenarioName - Scenario name
   * @param {string} scenarioData.restaurantName - Restaurant name
   * @param {string} scenarioData.description - Description
   * @param {Object} scenarioData.data - The actual data (tables, orders, etc.)
   * @returns {string} Scenario ID
   */
  const saveScenario = (scenarioData) => {
    const scenarioId = `scenario-${Date.now()}`;
    const scenario = {
      id: scenarioId,
      scenarioName: scenarioData.scenarioName,
      restaurantName: scenarioData.restaurantName,
      description: scenarioData.description || '',
      createdAt: new Date().toISOString(),
      data: scenarioData.data // Store reference to data location
    };

    // Save scenario data to localStorage with unique key
    try {
      localStorage.setItem(`never86_scenario_${scenarioId}`, JSON.stringify(scenarioData.data));
    } catch (error) {
      console.error('Error saving scenario data:', error);
      throw new Error('Failed to save scenario data. Data may be too large.');
    }

    // Add to scenarios list
    setScenarios(prev => [...prev, scenario]);

    return scenarioId;
  };

  /**
   * Load a scenario (sets as current)
   * 
   * @param {string} scenarioId - ID of scenario to load
   * @returns {Object} Scenario data
   */
  const loadScenario = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    // Load scenario data
    try {
      const data = JSON.parse(localStorage.getItem(`never86_scenario_${scenarioId}`));
      if (!data) {
        throw new Error('Scenario data not found');
      }

      // Set as current scenario
      setCurrentScenario(scenario);
      setRestaurantName(scenario.restaurantName);

      return {
        ...scenario,
        data
      };
    } catch (error) {
      console.error('Error loading scenario:', error);
      throw new Error(`Failed to load scenario: ${error.message}`);
    }
  };

  /**
   * Delete a scenario
   * 
   * @param {string} scenarioId - ID of scenario to delete
   */
  const deleteScenario = (scenarioId) => {
    // Remove from list
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));

    // Remove data from localStorage
    try {
      localStorage.removeItem(`never86_scenario_${scenarioId}`);
    } catch (error) {
      console.error('Error deleting scenario data:', error);
    }

    // If it was the current scenario, clear it
    if (currentScenario && currentScenario.id === scenarioId) {
      setCurrentScenario(null);
      setRestaurantName(null);
    }
  };

  /**
   * Export scenario as JSON
   * 
   * @param {string} scenarioId - ID of scenario to export
   * @returns {Object} Scenario data ready for export
   */
  const exportScenario = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    try {
      const data = JSON.parse(localStorage.getItem(`never86_scenario_${scenarioId}`));
      return {
        ...scenario,
        data
      };
    } catch (error) {
      throw new Error(`Failed to export scenario: ${error.message}`);
    }
  };

  /**
   * Clear current scenario (return to default state)
   */
  const clearScenario = () => {
    setCurrentScenario(null);
    setRestaurantName(null);
  };

  /**
   * Update restaurant name
   * 
   * @param {string} name - New restaurant name
   */
  const updateRestaurantName = (name) => {
    setRestaurantName(name);
    
    // Update current scenario if it exists
    if (currentScenario) {
      setCurrentScenario(prev => ({
        ...prev,
        restaurantName: name
      }));
    }
  };

  return (
    <ScenarioContext.Provider value={{
      // State
      currentScenario,
      restaurantName,
      scenarios,
      
      // Actions
      saveScenario,
      loadScenario,
      deleteScenario,
      exportScenario,
      clearScenario,
      updateRestaurantName
    }}>
      {children}
    </ScenarioContext.Provider>
  );
}

/**
 * useScenario Hook
 * 
 * Access scenario context in components
 */
export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenario must be used within ScenarioProvider');
  }
  return context;
}
