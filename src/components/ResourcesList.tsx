import React from 'react';
import { ExternalLink, Lock, Unlock } from 'lucide-react';
import { dataSources, dataCategories } from '../data/dataSources';

export default function ResourcesList() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Data Sources & Resources</h2>
      
      <div className="space-y-8">
        {dataCategories.map((category) => (
          <div key={category.name} className="border-b pb-6 last:border-b-0">
            <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
            <div className="grid gap-4">
              {dataSources
                .filter((source) => category.sources.includes(source.name))
                .map((source) => (
                  <div key={source.name} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium flex items-center gap-2">
                        {source.name}
                        {source.accessType === 'free' ? (
                          <Unlock className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-amber-600" />
                        )}
                      </h4>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Visit <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <p className="text-gray-600 mb-2">{source.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {source.dataTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}