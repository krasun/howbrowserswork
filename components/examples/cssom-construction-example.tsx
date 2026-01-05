"use client";

import { useState } from "react";

const defaultCSS = `body {
  font-family: Arial, sans-serif;
  margin: 0;
}

.header {
  background: #333;
  color: white;
  padding: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}`;

interface CSSOMNode {
  selector: string;
  properties: Record<string, string>;
  specificity: number;
}

export default function CssomConstructionExample() {
  const [cssInput, setCssInput] = useState(defaultCSS);
  const [showCSSOM, setShowCSSOM] = useState(false);

  const parseCSSToCSOM = (css: string): CSSOMNode[] => {
    const rules: CSSOMNode[] = [];
    const ruleRegex = /([^{]+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(css)) !== null) {
      const selector = match[1].trim();
      const declarations = match[2].trim();
      
      const properties: Record<string, string> = {};
      const propRegex = /([^:]+):\s*([^;]+);?/g;
      let propMatch;
      
      while ((propMatch = propRegex.exec(declarations)) !== null) {
        const property = propMatch[1].trim();
        const value = propMatch[2].trim();
        properties[property] = value;
      }

      // Simple specificity calculation
      const specificity = calculateSpecificity(selector);
      
      rules.push({ selector, properties, specificity });
    }

    return rules;
  };

  const calculateSpecificity = (selector: string): number => {
    let specificity = 0;
    if (selector.includes('#')) specificity += 100;
    if (selector.includes('.')) specificity += 10;
    if (selector.match(/^[a-zA-Z]/)) specificity += 1;
    return specificity;
  };

  const cssomNodes = parseCSSToCSOM(cssInput);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">CSS Input</h4>
          <textarea
            value={cssInput}
            onChange={(e) => setCssInput(e.target.value)}
            className="w-full h-48 p-3 border rounded font-mono text-sm"
            placeholder="Enter CSS rules..."
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">CSSOM Tree</h4>
            <button
              onClick={() => setShowCSSOM(!showCSSOM)}
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              {showCSSOM ? 'Hide' : 'Build'} CSSOM
            </button>
          </div>
          
          {showCSSOM && (
            <div className="h-48 p-3 border rounded bg-gray-50 overflow-y-auto">
              <div className="space-y-3">
                {cssomNodes.map((node, index) => (
                  <div key={index} className="border-l-2 border-purple-400 pl-3">
                    <div className="font-mono text-sm font-semibold text-purple-700">
                      {node.selector}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      Specificity: {node.specificity}
                    </div>
                    <div className="space-y-1">
                      {Object.entries(node.properties).map(([prop, value]) => (
                        <div key={prop} className="text-xs font-mono">
                          <span className="text-blue-600">{prop}</span>: 
                          <span className="text-green-600 ml-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!showCSSOM && (
            <div className="h-48 p-3 border rounded bg-gray-100 flex items-center justify-center text-gray-500">
              Click "Build CSSOM" to parse CSS into object model
            </div>
          )}
        </div>
      </div>
      
      {showCSSOM && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <h5 className="font-semibold text-sm mb-2">CSSOM Features Demonstrated:</h5>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• <strong>Selector parsing:</strong> CSS selectors become CSSOM rule objects</li>
            <li>• <strong>Specificity calculation:</strong> Higher specificity rules override lower ones</li>
            <li>• <strong>Property resolution:</strong> Declarations become computed style properties</li>
            <li>• <strong>Tree structure:</strong> Rules are organized for efficient style matching</li>
          </ul>
        </div>
      )}
    </div>
  );
}
