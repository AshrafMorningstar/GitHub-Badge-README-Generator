import React, { useState, useMemo } from 'react';
import { Badge, BadgeCategory, BadgeRarity } from '../types';

interface BadgeGalleryProps {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  onContinue: () => void;
  isProcessing: boolean;
}

const BadgeGallery: React.FC<BadgeGalleryProps> = ({ badges, setBadges, onContinue, isProcessing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'name' | 'rarity' | 'category'>('category');
  const [filterType, setFilterType] = useState<'all' | 'owned' | 'unowned'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null); // For Dedicated Detail View
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // For Manual Add

  // Manual Add State
  const [newBadge, setNewBadge] = useState<Partial<Badge>>({
    name: '', emoji: '🆕', description: '', category: 'Custom', rarity: 'Common', tiers: ['Single Tier'], howToEarn: ''
  });

  // Derived State
  const filteredBadges = useMemo(() => {
    let result = [...badges];

    // Filter
    if (filterType === 'owned') result = result.filter(b => b.isOwned);
    if (filterType === 'unowned') result = result.filter(b => !b.isOwned);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(b => b.name.toLowerCase().includes(lower) || b.description.toLowerCase().includes(lower));
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'category') return a.category.localeCompare(b.category);
      if (sortOption === 'rarity') {
        const rarityOrder: Record<BadgeRarity, number> = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4 };
        return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
      }
      return 0;
    });

    return result;
  }, [badges, searchTerm, sortOption, filterType]);

  const toggleOwnership = (id: string) => {
    setBadges(prev => prev.map(b => b.id === id ? { ...b, isOwned: !b.isOwned } : b));
  };

  const handleManualAdd = () => {
    const badgeToAdd: Badge = {
        id: `custom-${Date.now()}`,
        name: newBadge.name || 'Custom Badge',
        emoji: newBadge.emoji || '✨',
        description: newBadge.description || 'Custom description',
        category: 'Custom',
        rarity: newBadge.rarity as BadgeRarity || 'Common',
        tiers: newBadge.tiers || ['Single Tier'],
        howToEarn: newBadge.howToEarn || 'Custom strategy',
        isOwned: true
    };
    setBadges(prev => [badgeToAdd, ...prev]);
    setIsAddModalOpen(false);
    setNewBadge({ name: '', emoji: '🆕', description: '', category: 'Custom', rarity: 'Common', tiers: ['Single Tier'], howToEarn: '' });
  };

  // Dedicated Detail View Component
  if (selectedBadge) {
    return (
      <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Navigation */}
        <div className="p-6 sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
           <button 
             onClick={() => setSelectedBadge(null)}
             className="group flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
           >
             <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-colors">
               ←
             </div>
             <span className="font-semibold text-sm">Back to Gallery</span>
           </button>
           <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">{selectedBadge.id}</div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-8">
           {/* Hero Header */}
           <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-8xl md:text-9xl select-none transform transition-transform duration-500 hover:scale-110 hover:rotate-3">
                    {selectedBadge.emoji}
                 </div>
                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                    {selectedBadge.rarity}
                 </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                 <div>
                   <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedBadge.name}</h1>
                   <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wide border border-indigo-200 dark:border-indigo-800">
                        {selectedBadge.category}
                      </span>
                   </div>
                 </div>
                 <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                   {selectedBadge.description}
                 </p>
                 
                 <div className="pt-4 flex justify-center md:justify-start">
                   <button 
                     onClick={() => { toggleOwnership(selectedBadge.id); setSelectedBadge(prev => prev ? {...prev, isOwned: !prev.isOwned} : null); }}
                     className={`px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all transform active:scale-95 shadow-lg
                       ${selectedBadge.isOwned 
                         ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                         : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30'}`}
                   >
                     {selectedBadge.isOwned ? '✅ Collected' : 'Mark as Owned'}
                   </button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {/* How to Earn */}
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Strategy</h3>
                 <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                   {selectedBadge.howToEarn}
                 </p>
              </div>

              {/* Tiers */}
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Tiers</h3>
                 <div className="space-y-3">
                   {selectedBadge.tiers.map((tier, idx) => (
                     <div key={idx} className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                         {idx + 1}
                       </div>
                       <span className="text-slate-700 dark:text-slate-200 font-medium">{tier}</span>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden relative">
      
      {/* Header / Controls */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-10 space-y-4 sticky top-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Badge Gallery</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Select badges to include in your guide.</p>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={() => setIsAddModalOpen(true)}
               className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
             >
               + Add Custom
             </button>
             <button 
               onClick={onContinue}
               disabled={isProcessing}
               className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform hover:scale-105"
             >
               {isProcessing ? 'Processing...' : 'Generate README →'}
             </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-[240px] shadow-sm"
            />
          </div>
          
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 outline-none shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-slate-700"
          >
            <option value="category">Category</option>
            <option value="rarity">Rarity</option>
            <option value="name">Name</option>
          </select>

          <div className="flex bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            {(['all', 'owned', 'unowned'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${filterType === type ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredBadges.map(badge => (
            <div 
              key={badge.id}
              className={`group relative flex flex-col bg-white dark:bg-slate-800/80 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 ease-out cursor-pointer hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20
                ${badge.isOwned 
                  ? 'border-indigo-500/30 ring-1 ring-indigo-500/10 dark:border-indigo-500/30' 
                  : 'border-slate-200 dark:border-slate-700/50'}`}
              onClick={() => setSelectedBadge(badge)}
            >
              <div className="flex items-start justify-between mb-4">
                {/* Badge Emoji with Rarity Tooltip */}
                <div className="relative group/emoji z-30">
                  <div className="text-4xl filter drop-shadow-md transition-transform duration-300 group-hover:scale-110">
                    {badge.emoji}
                  </div>
                  <div className="absolute left-0 top-full mt-2 hidden group-hover/emoji:block px-2 py-1 bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider rounded shadow-lg border border-slate-700 whitespace-nowrap z-50">
                    {badge.rarity}
                  </div>
                </div>

                {/* Ownership Toggle */}
                <div 
                  onClick={(e) => { e.stopPropagation(); toggleOwnership(badge.id); }}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 z-10 hover:scale-110
                    ${badge.isOwned 
                      ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 bg-white dark:bg-slate-800'}`}
                >
                  {badge.isOwned && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white truncate tracking-tight text-lg">{badge.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{badge.description}</p>
              
              <div className="mt-auto pt-4 flex items-center gap-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border
                  ${badge.rarity === 'Common' ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500' :
                    badge.rarity === 'Rare' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-600' :
                    badge.rarity === 'Epic' ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/30 text-purple-600' :
                    'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30 text-amber-600'
                  }`}>
                  {badge.rarity}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{badge.category}</span>
              </div>
              
              {/* Decorative Glow */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-transparent via-transparent to-indigo-500/5 dark:to-indigo-400/10`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all scale-100">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Create Custom Badge</h3>
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Badge Name</label>
                  <input 
                    placeholder="e.g. Bug Hunter" 
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    value={newBadge.name}
                    onChange={e => setNewBadge({...newBadge, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Emoji</label>
                  <input 
                    placeholder="e.g. 🐛" 
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    value={newBadge.emoji}
                    onChange={e => setNewBadge({...newBadge, emoji: e.target.value})}
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
                  <textarea 
                    placeholder="Brief description..." 
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none h-24"
                    value={newBadge.description}
                    onChange={e => setNewBadge({...newBadge, description: e.target.value})}
                  />
               </div>
             </div>
             <div className="flex gap-3 mt-8">
                <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button onClick={handleManualAdd} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-all">Add Badge</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeGallery;