import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: 'line' | 'pills' | 'boxed' | 'underline';
  vertical?: boolean;
  onChange?: (tabId: string) => void;
  fullWidth?: boolean;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'line',
  vertical = false,
  onChange,
  fullWidth = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || (tabs.length > 0 ? tabs[0].id : '')
  );

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  // Get the currently active tab content
  const getActiveTabContent = () => {
    const tab = tabs.find(tab => tab.id === activeTab);
    return tab ? tab.content : null;
  };

  // Get the variant-specific classes for the tabs container
  const getTabsContainerClass = () => {
    switch (variant) {
      case 'pills':
        return 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg';
      case 'boxed':
        return 'border-b border-gray-200 dark:border-gray-700';
      case 'underline':
        return '';
      case 'line':
      default:
        return 'border-b border-gray-200 dark:border-gray-700';
    }
  };

  // Get classes for individual tab
  const getTabClass = (tab: TabItem) => {
    const isActive = activeTab === tab.id;
    const isDisabled = tab.disabled;
    
    let baseClasses = `
      flex items-center px-3 py-2 text-sm font-medium transition-colors
      ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      ${fullWidth ? 'flex-1 justify-center' : ''}
    `;
    
    switch (variant) {
      case 'pills':
        return `${baseClasses} ${
          isActive
            ? 'bg-white dark:bg-gray-700 shadow text-primary dark:text-primary-light rounded-md'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
        }`;
        
      case 'boxed':
        return `${baseClasses} ${
          isActive
            ? 'bg-white dark:bg-gray-800 text-primary dark:text-primary-light border-t border-l border-r border-gray-200 dark:border-gray-700 rounded-t-lg -mb-px'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
        }`;
        
      case 'underline':
        return `${baseClasses} ${
          isActive
            ? 'text-primary dark:text-primary-light relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary dark:after:bg-primary-light'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
        }`;
        
      case 'line':
      default:
        return `${baseClasses} ${
          isActive
            ? 'border-b-2 border-primary dark:border-primary-light text-primary dark:text-primary-light'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
        }`;
    }
  };

  return (
    <div className={`${vertical ? 'flex flex-row' : 'flex flex-col'} ${className}`}>
      <div className={`${vertical ? 'flex-shrink-0 flex flex-col mr-4' : 'flex'} ${getTabsContainerClass()}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.disabled)}
            className={getTabClass(tab)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            tabIndex={tab.disabled ? -1 : 0}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className={`${vertical ? 'flex-grow' : ''} pt-4`}>
        {getActiveTabContent()}
      </div>
    </div>
  );
};

export default Tabs;
