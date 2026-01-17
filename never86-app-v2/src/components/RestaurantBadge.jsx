/**
 * RESTAURANT BADGE COMPONENT
 * 
 * Displays the restaurant name in the bottom corner when a custom scenario is active.
 */

import { useContext } from 'react';
import { ScenarioContext } from '../context/ScenarioContext';

export default function RestaurantBadge() {
  // Use useContext directly to avoid hook error if provider not available
  const context = useContext(ScenarioContext);
  const restaurantName = context?.restaurantName;

  if (!restaurantName) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none">
      <div className="bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-1.5 shadow-lg">
        <p className="text-xs text-muted-foreground font-medium">
          {restaurantName}
        </p>
      </div>
    </div>
  );
}
