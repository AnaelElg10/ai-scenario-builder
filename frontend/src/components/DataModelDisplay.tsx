'use client';

/**
 * Data Model Display Component
 * 
 * Displays the generated data model with entities and relationships
 * in a structured, readable format.
 */

import { DataModel } from '@/lib/types';

interface DataModelDisplayProps {
  dataModel: DataModel;
}

// Get icon for property type
function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    string: '📝',
    number: '🔢',
    integer: '🔢',
    boolean: '✓',
    array: '📚',
    object: '📦',
  };
  return icons[type] || '📄';
}

export default function DataModelDisplay({ dataModel }: DataModelDisplayProps) {
  if (!dataModel || !dataModel.entities) {
    return (
      <div className="text-gray-500 text-center py-8">
        No data model available
      </div>
    );
  }

  const entityNames = Object.keys(dataModel.entities);

  return (
    <div className="space-y-6">
      {/* Entities */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-lg">📊</span>
          Entities ({entityNames.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entityNames.map((entityName) => {
            const entity = dataModel.entities[entityName];
            const properties = entity.properties ? Object.entries(entity.properties) : [];
            
            return (
              <div
                key={entityName}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Entity header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <span className="text-lg">🗃️</span>
                    {entityName}
                  </h5>
                </div>
                
                {/* Properties */}
                <div className="p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase">
                        <th className="text-left pb-2">Property</th>
                        <th className="text-left pb-2">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.slice(0, 6).map(([propName, propDef]) => (
                        <tr key={propName} className="border-t border-gray-100">
                          <td className="py-1.5 font-medium text-gray-800 flex items-center gap-1">
                            <span className="text-sm">{getTypeIcon(propDef.type)}</span>
                            {propName}
                            {entity.required?.includes(propName) && (
                              <span className="text-red-500 text-xs">*</span>
                            )}
                          </td>
                          <td className="py-1.5 text-gray-600">
                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                              {propDef.type}
                              {propDef.format && ` (${propDef.format})`}
                            </code>
                          </td>
                        </tr>
                      ))}
                      {properties.length > 6 && (
                        <tr className="border-t border-gray-100">
                          <td colSpan={2} className="py-1.5 text-gray-500 text-xs italic">
                            +{properties.length - 6} more properties
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relationships */}
      {dataModel.relationships && dataModel.relationships.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">🔗</span>
            Relationships ({dataModel.relationships.length})
          </h4>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 text-xs uppercase">
                  <th className="text-left px-4 py-2">From</th>
                  <th className="text-left px-4 py-2">To</th>
                  <th className="text-left px-4 py-2">Type</th>
                  <th className="text-left px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {dataModel.relationships.map((rel, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-medium text-blue-600">{rel.from}</td>
                    <td className="px-4 py-2 font-medium text-green-600">{rel.to}</td>
                    <td className="px-4 py-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                        {rel.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{rel.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
