import fs from 'fs';
const content = fs.readFileSync('src/App.tsx', 'utf8');

// Identify the start of the corruption
const corruptionStart = "{/* Theme List */}";
const corruptionEnd = "{/* Card Background Tab */}";

const goodContentPrefix = `                  {/* Theme List */}
                  {activeTab === 'theme' && (
                    <div className="flex flex-col gap-5 pr-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 pt-2 pb-4">
                        {themes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleThemeChange(t.id)}
                            className={\`flex flex-col items-start gap-1 p-3.5 rounded-2xl text-xs transition-all border \${
                              theme === t.id 
                                ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/20' 
                                : 'bg-black/5 border-transparent hover:bg-black/10'
                            }\`}
                          >
                            <span className="text-sm truncate w-full text-left font-medium">{t.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scheme List */}
                  {activeTab === 'scheme' && (
                    <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 pb-4">
                      <div className="grid grid-cols-4 gap-3 gap-y-5 px-1 pt-3">
                        {colorSchemes.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleSchemeChange(s.id)}
                            className={\`w-7 h-7 rounded-full border transition-all flex items-center justify-center mx-auto \${
                              scheme === s.id ? 'ring-2 ring-rose-600 border-rose-600' : 'hover:scale-110 border-black/5 opacity-80 hover:opacity-100'
                            } \${s.bg}\`}
                            title={s.name}
                          />
                        ))}
                        <label
                          className={\`w-7 h-7 rounded-full bg-white border transition-all flex items-center justify-center mx-auto cursor-pointer shadow-sm \${
                            scheme === 'custom' ? 'ring-2 ring-rose-600 ring-offset-1 border-transparent' : 'border-black/10 hover:scale-125'
                          }\`}
                          title="自定义颜色"
                        >
                          <input 
                            type="color" 
                            value={customPrimaryColor || '#3B82F6'} 
                            onChange={(e) => handleCustomPrimaryChange(e.target.value)}
                            className="sr-only"
                          />
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ 
                              backgroundColor: customPrimaryColor || '#3B82F6',
                              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
                            }} 
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Background List */}
                  {activeTab === 'background' && (
                    <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 pb-4">
                      <div className="grid grid-cols-4 gap-3 gap-y-5 px-1 pt-3">
                        {backgrounds.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => handleBgChange(b.id)}
                            className={\`w-7 h-7 rounded-full border transition-all flex items-center justify-center mx-auto \${
                              bgId === b.id ? 'ring-2 ring-rose-600 border-rose-600' : 'hover:scale-110 border-black/5 opacity-80 hover:opacity-100'
                            } \${b.preview}\`}
                            title={b.name}
                            style={{ backgroundColor: b.color }}
                          />
                        ))}
                        <label
                          className={\`w-7 h-7 rounded-full bg-white border transition-all flex items-center justify-center mx-auto cursor-pointer shadow-sm \${
                            bgId === 'custom-color' ? 'ring-2 ring-rose-600 ring-offset-1 border-transparent' : 'border-black/10 hover:scale-125'
                          }\`}
                          title="自定义配色"
                        >
                          <input 
                            type="color" 
                            value={customAppBgColor || '#F5F5F5'} 
                            onChange={(e) => handleCustomAppBgChange(e.target.value)}
                            className="sr-only"
                          />
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ 
                              backgroundColor: customAppBgColor || '#F5F5F5',
                              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
                            }} 
                          />
                        </label>
                      </div>
                    </div>
                  )}
`;

const startIndex = content.indexOf(corruptionStart);
const endIndex = content.indexOf(corruptionEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + goodContentPrefix + content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', newContent);
  console.log('Successfully repaired corrupted sections and applied Focal Dot design');
} else {
  console.log('Could not find corruption boundaries');
}
