import { useState, useEffect, useMemo, useRef, ChangeEvent } from "react";
import { 
  Dices, Plus, Trash2, X, ChevronDown, ChevronUp, Edit3, Save, 
  Download, Upload, HelpCircle, Activity, Heart, Shield, RefreshCw, Sparkles, BookOpen, Star, Sparkle, Eye, Crown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CharacterState, Matrix, Merit, Mantle, Item, Summon, TierGroup, TierLevel } from "./types";
import { TIER_LEVELS, TIER_GROUPS, DEFAULT_CHAR } from "./data";
import { ORIGINAL_HTML_TEMPLATE } from "./htmlTemplate";

export default function App() {
  // State initialization with local storage integration
  const [state, setState] = useState<CharacterState>(() => {
    const saved = localStorage.getItem("cypheric_character");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure standard fields exist
        if (parsed.name && parsed.tierLevel) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved character state:", e);
      }
    }
    return DEFAULT_CHAR();
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMantleTabs, setActiveMantleTabs] = useState<Record<number, string | null>>({});

  // Dice roll outputs state
  const [rollOutputs, setRollOutputs] = useState({
    oneDx: "",
    fullDx: "",
    hit: "",
    resist: "",
    init: "",
    summon: ""
  });

  // Trackers adjusting modals
  const [adjustingTracker, setAdjustingTracker] = useState<"thauma" | "health" | null>(null);
  const [trackerAdjustInput, setTrackerAdjustInput] = useState("");

  // Persist state updates to local storage
  useEffect(() => {
    localStorage.setItem("cypheric_character", JSON.stringify(state));
  }, [state]);

  // Derived stats calculations
  const tierData = useMemo(() => {
    return TIER_LEVELS.find((t) => t.name === state.tierLevel) || TIER_LEVELS[0];
  }, [state.tierLevel]);

  const groupData = useMemo(() => {
    return TIER_GROUPS[tierData.group] || TIER_GROUPS["Mortal"];
  }, [tierData]);

  const maxThauma = useMemo(() => {
    const { hm, sn, wl } = state;
    return Math.ceil((hm / 0.9) + (sn * 1.2) + (wl / 0.9));
  }, [state.hm, state.sn, state.wl]);

  const maxHealth = useMemo(() => {
    const { hm, sn, wl } = state;
    return Math.ceil((hm / 0.9) + (sn / 0.9) + (wl * 1.2) + Number(tierData.health) + Number(state.flatHealthBonus || 0));
  }, [state.hm, state.sn, state.wl, tierData.health, state.flatHealthBonus]);

  const ability = useMemo(() => {
    const { hm, sn, wl } = state;
    return Math.ceil((hm * 0.3) + (sn * 0.2) + (wl * 0.2));
  }, [state.hm, state.sn, state.wl]);

  const aspect = useMemo(() => {
    const { hm, sn, wl } = state;
    const max = Math.max(hm, sn, wl);
    if (max === hm) return "Harmonics";
    if (max === wl) return "Wavelength";
    return "Sanity";
  }, [state.hm, state.sn, state.wl]);

  const usedPoints = useMemo(() => {
    return Number(state.hm) + Number(state.sn) + Number(state.wl);
  }, [state.hm, state.sn, state.wl]);

  const isPointsOver = usedPoints > tierData.statPoints;

  // Sync current trackers to maximums on baseline resets
  useEffect(() => {
    if (state.currentThauma === null) {
      setState((prev) => ({ ...prev, currentThauma: maxThauma }));
    }
    if (state.currentHealth === null) {
      setState((prev) => ({ ...prev, currentHealth: maxHealth }));
    }
  }, [state.currentThauma, state.currentHealth, maxThauma, maxHealth]);

  // Automatic evaluation of tier threshold based on total stat points assigned
  const handleStatChange = (field: "hm" | "sn" | "wl", value: number) => {
    setState((prev) => {
      const hmTotal = prev.thaumagen.hm.sub + prev.thaumagen.hm.data + prev.thaumagen.hm.sync;
      const snTotal = prev.thaumagen.sn.sub + prev.thaumagen.sn.data + prev.thaumagen.sn.sync;
      const wlTotal = prev.thaumagen.wl.sub + prev.thaumagen.wl.data + prev.thaumagen.wl.sync;

      const limit = field === "hm" ? hmTotal : field === "sn" ? snTotal : wlTotal;

      if (value > limit) {
        alert(`You lack depth in ${field.toUpperCase()}... State limits have reached their maximum possible values for current thaumagen bank configurations.`);
        return prev;
      }

      const updated = { ...prev, [field]: value };
      const currentUsedPoints = Number(updated.hm) + Number(updated.sn) + Number(updated.wl);

      // Recalculate highest valid tier level matching our used points allocation
      let selectedTier = TIER_LEVELS[0].name;
      for (let i = 0; i < TIER_LEVELS.length; i++) {
        if (currentUsedPoints >= TIER_LEVELS[i].statPoints) {
          selectedTier = TIER_LEVELS[i].name;
        }
      }

      updated.tierLevel = selectedTier;
      return updated;
    });
  };

  // Macro baseline assigner
  const applyTierMacroBaseline = (levelName: string) => {
    const matched = TIER_LEVELS.find((t) => t.name === levelName);
    if (!matched) return;

    const budget = matched.statPoints;
    const equalSplit = Math.floor(budget / 3);
    const leftOver = budget % 3;

    const newHm = equalSplit + (leftOver > 0 ? 1 : 0);
    const newSn = equalSplit + (leftOver > 1 ? 1 : 0);
    const newWl = equalSplit;

    setState((prev) => {
      const updated = {
        ...prev,
        tierLevel: levelName,
        hm: newHm,
        sn: newSn,
        wl: newWl,
        thaumagen: {
          hm: { ...prev.thaumagen.hm, sub: newHm },
          sn: { ...prev.thaumagen.sn, sub: newSn },
          wl: { ...prev.thaumagen.wl, sub: newWl },
        }
      };

      // Recalculate trackers directly
      const tempMaxThauma = Math.ceil((newHm / 0.9) + (newSn * 1.2) + (newWl / 0.9));
      const tempMaxHealth = Math.ceil((newHm / 0.9) + (newSn / 0.9) + (newWl * 1.2) + Number(matched.health) + Number(prev.flatHealthBonus || 0));

      updated.currentThauma = tempMaxThauma;
      updated.currentHealth = tempMaxHealth;

      return updated;
    });
  };

  // Bank update changes
  const handleBankChange = (aspect: "hm" | "sn" | "wl", type: "sub" | "data" | "sync", val: number) => {
    setState((prev) => {
      const updatedThaumagen = {
        ...prev.thaumagen,
        [aspect]: {
          ...prev.thaumagen[aspect],
          [type]: val
        }
      };
      return {
        ...prev,
        thaumagen: updatedThaumagen
      };
    });
  };

  // Tracker adjustment actions
  const adjustTrackerValue = (isAdd: boolean, amountStr: string) => {
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount)) return;

    setState((prev) => {
      if (adjustingTracker === "thauma") {
        const cur = prev.currentThauma ?? maxThauma;
        const nextVal = isAdd ? cur + amount : cur - amount;
        return { ...prev, currentThauma: nextVal };
      } else {
        const cur = prev.currentHealth ?? maxHealth;
        const nextVal = isAdd ? cur + amount : cur - amount;
        return { ...prev, currentHealth: nextVal };
      }
    });

    setTrackerAdjustInput("");
    setAdjustingTracker(null);
  };

  const setAbsoluteTrackerValue = (valStr: string) => {
    const val = parseInt(valStr, 10);
    if (isNaN(val)) return;

    setState((prev) => {
      if (adjustingTracker === "thauma") {
        return { ...prev, currentThauma: val };
      } else {
        return { ...prev, currentHealth: val };
      }
    });

    setTrackerAdjustInput("");
    setAdjustingTracker(null);
  };

  // Dice Rolls logic
  const handleRoll = (type: string, param?: string) => {
    const abilityFmt = Math.round(ability * 100) / 100;
    
    if (type === "oneDx") {
      const roll = 1 + Math.floor(Math.random() * groupData.sides);
      setRollOutputs((prev) => ({
        ...prev,
        oneDx: `1d${groupData.sides}: [${roll}]`
      }));
    } else if (type === "fullDx") {
      const rolls = [];
      for (let i = 0; i < groupData.n; i++) {
        rolls.push(1 + Math.floor(Math.random() * groupData.sides));
      }
      const sum = rolls.reduce((a, b) => a + b, 0);
      setRollOutputs((prev) => ({
        ...prev,
        fullDx: `[${rolls.join(", ")}] = ${sum}`
      }));
    } else if (type === "hit" || type === "resist") {
      const roll = 1 + Math.floor(Math.random() * groupData.sides);
      const total = Number((roll + abilityFmt).toFixed(2));
      setRollOutputs((prev) => ({
        ...prev,
        [type]: `1d${groupData.sides} [${roll}] + Ab ${abilityFmt} = ${total}`
      }));
    } else if (type === "init") {
      const roll = 1 + Math.floor(Math.random() * groupData.sides);
      const total = Number((abilityFmt + roll).toFixed(2));
      setRollOutputs((prev) => ({
        ...prev,
        init: `Ab ${abilityFmt} + 1d${groupData.sides} [${roll}] = ${total}`
      }));
    } else if (type === "summon" && param !== undefined) {
      const summonIndex = parseInt(param, 10);
      const summon = state.summons[summonIndex];
      if (!summon) return;
      const d20 = 1 + Math.floor(Math.random() * 20);
      const dxRoll = 1 + Math.floor(Math.random() * groupData.sides);
      const san = Number(state.sn) || 0;
      const total = d20 + dxRoll + san;
      setRollOutputs((prev) => ({
        ...prev,
        summon: `${summon.name || "Summon"}: d20[${d20}] + 1d${groupData.sides}[${dxRoll}] + Sanity[${san}] = ${total}`
      }));
      setSidebarOpen(true); // Open sidebar automatically to show the result
    }
  };

  const handleClearRoll = (key: keyof typeof rollOutputs) => {
    setRollOutputs((prev) => ({ ...prev, [key]: "" }));
  };

  // List additions
  const handleAddListEntry = (key: "matrices" | "merits" | "items" | "summons") => {
    setState((prev) => {
      const newEntry = { name: "", isEditing: true, isOpen: false, effect: "" };
      return {
        ...prev,
        [key]: [...prev[key], newEntry]
      };
    });
  };

  const handleUpdateListField = (key: "matrices" | "merits" | "items" | "summons", index: number, field: string, val: any) => {
    setState((prev) => {
      const listCopy = [...prev[key]];
      listCopy[index] = { ...listCopy[index], [field]: val };
      return { ...prev, [key]: listCopy };
    });
  };

  const handleDeleteListEntry = (key: "matrices" | "merits" | "items" | "summons", index: number) => {
    setState((prev) => {
      const listCopy = prev[key].filter((_, idx) => idx !== index);
      return { ...prev, [key]: listCopy };
    });
  };

  // Mantles specific logic
  const handleAddMantle = () => {
    setState((prev) => {
      const newMantle: Mantle = {
        name: "",
        isEditing: true,
        isOpen: false,
        effects: [],
        matrices: []
      };
      return {
        ...prev,
        mantles: [...prev.mantles, newMantle]
      };
    });
  };

  const handleUpdateMantleName = (mIndex: number, name: string) => {
    setState((prev) => {
      const mantlesCopy = [...prev.mantles];
      mantlesCopy[mIndex] = { ...mantlesCopy[mIndex], name };
      return { ...prev, mantles: mantlesCopy };
    });
  };

  const handleMantleToggleState = (mIndex: number, field: "isEditing" | "isOpen", val: boolean) => {
    setState((prev) => {
      const mantlesCopy = [...prev.mantles];
      mantlesCopy[mIndex] = { ...mantlesCopy[mIndex], [field]: val };
      return { ...prev, mantles: mantlesCopy };
    });
  };

  const handleDeleteMantle = (mIndex: number) => {
    setState((prev) => {
      const mantlesCopy = prev.mantles.filter((_, idx) => idx !== mIndex);
      return { ...prev, mantles: mantlesCopy };
    });
  };

  const handleAddMantleEffect = (mIndex: number) => {
    setState((prev) => {
      const mantlesCopy = [...prev.mantles];
      mantlesCopy[mIndex] = {
        ...mantlesCopy[mIndex],
        effects: [...(mantlesCopy[mIndex].effects || []), { name: "", effect: "" }]
      };
      return { ...prev, mantles: mantlesCopy };
    });
  };

  const handleUpdateMantleEffect = (mIndex: number, eIndex: number, field: "name" | "effect", val: string) => {
    setState((prev) => {
      const mantlesCopy = [...prev.mantles];
      const effCopy = [...mantlesCopy[mIndex].effects];
      effCopy[eIndex] = { ...effCopy[eIndex], [field]: val };
      mantlesCopy[mIndex] = { ...mantlesCopy[mIndex], effects: effCopy };
      return { ...prev, mantles: mantlesCopy };
    });
  };

  const handleDeleteMantleEffect = (mIndex: number, eIndex: number) => {
    setState((prev) => {
      const mantlesCopy = [...prev.mantles];
      const effCopy = mantlesCopy[mIndex].effects.filter((_, idx) => idx !== eIndex);
      mantlesCopy[mIndex] = { ...mantlesCopy[mIndex], effects: effCopy };
      return { ...prev, mantles: mantlesCopy };
    });
  };

  const handleAddMantleMatrix = (mIndex: number) => {
    setState((prev) => {
      const mantlesCopy = [...prev.mantles];
      mantlesCopy[mIndex] = {
        ...mantlesCopy[mIndex],
        matrices: [...(mantlesCopy[mIndex].matrices || []), { name: "", tags: "", aspect: "", effect: "" }]
      };
      return { ...prev, mantles: mantlesCopy };
    });
  };

  const handleUpdateMantleMatrix = (mIndex: number, matIndex: number, field: string, val: string) => {
    setState((prev) => {
      const mantlesCopy = [...prev.mantles];
      const matCopy = [...mantlesCopy[mIndex].matrices];
      matCopy[matIndex] = { ...matCopy[matIndex], [field]: val };
      mantlesCopy[mIndex] = { ...mantlesCopy[mIndex], matrices: matCopy };
      return { ...prev, mantles: mantlesCopy };
    });
  };

  const handleDeleteMantleMatrix = (mIndex: number, matIndex: number) => {
    setState((prev) => {
      const mantlesCopy = [...prev.mantles];
      const matCopy = mantlesCopy[mIndex].matrices.filter((_, idx) => idx !== matIndex);
      mantlesCopy[mIndex] = { ...mantlesCopy[mIndex], matrices: matCopy };
      return { ...prev, mantles: mantlesCopy };
    });
  };

  // Export functions
  const exportAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    const cleanedName = state.name.replace(/[^a-z0-9]/gi, "_");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${cleanedName || "Unnamed"}_Ledger.json`);
    downloadAnchor.click();
  };

  const exportAsStandaloneHtml = () => {
    // Replaces placeholder inside ORIGINAL_HTML_TEMPLATE with actual serialized state
    const placeholder = "__STATE_JSON__";
    const stateJson = JSON.stringify(state);
    
    let compiledHtml = ORIGINAL_HTML_TEMPLATE;
    if (compiledHtml.includes(placeholder)) {
      compiledHtml = compiledHtml.split(placeholder).join(stateJson);
    } else {
      // Fallback injection if anchor is different
      const anchor = "/*CHARDATA_START*/const EMBEDDED_CHARACTER_DATA = ";
      const anchorIdx = compiledHtml.indexOf(anchor);
      if (anchorIdx !== -1) {
        const afterAnchor = compiledHtml.slice(anchorIdx + anchor.length);
        const nextSemiColonIdx = afterAnchor.indexOf(";/*CHARDATA_END*/");
        if (nextSemiColonIdx !== -1) {
          const before = compiledHtml.slice(0, anchorIdx + anchor.length);
          const after = afterAnchor.slice(nextSemiColonIdx);
          compiledHtml = before + stateJson + after;
        }
      }
    }

    const compiledBlob = new Blob([compiledHtml], { type: "text/html;charset=utf-8" });
    const virtualAnchor = document.createElement("a");
    const cleanedName = state.name.replace(/[^a-z0-9]/gi, "_");
    virtualAnchor.download = `${cleanedName || "Unnamed"}_Cypheric_Ledger.html`;
    virtualAnchor.href = URL.createObjectURL(compiledBlob);
    virtualAnchor.click();
    URL.revokeObjectURL(virtualAnchor.href);
  };

  // Import functions
  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        // Attempt 1: Parse directly as raw JSON
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object" && "name" in parsed && "tierLevel" in parsed) {
          setState(parsed);
          alert(`Successfully imported character "${parsed.name}" from JSON ledger file!`);
          return;
        }
      } catch (err) {
        // Not a direct JSON file, proceed to Attempt 2: Standalone HTML ledger parsing
      }

      // Attempt 2: Search for embedded state marker in HTML source
      try {
        const startMarker = "/*CHARDATA_START*/const EMBEDDED_CHARACTER_DATA = ";
        const endMarker = ";/*CHARDATA_END*/";
        const startIdx = text.indexOf(startMarker);
        if (startIdx !== -1) {
          const contentAfterStart = text.slice(startIdx + startMarker.length);
          const endIdx = contentAfterStart.indexOf(endMarker);
          if (endIdx !== -1) {
            const rawJson = contentAfterStart.slice(0, endIdx);
            const parsed = JSON.parse(rawJson);
            if (parsed && typeof parsed === "object") {
              setState(parsed);
              alert(`Successfully extracted and imported character "${parsed.name || "Unnamed"}" from HTML ledger file!`);
              return;
            }
          }
        }
        alert("Unable to parse file. Please upload a valid JSON backup or a previously exported standalone Cypheric Ledger HTML file.");
      } catch (err) {
        console.error(err);
        alert("Error parsing file structure. Verify the file has not been manually edited or corrupted.");
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset file input
  };

  // Reset state to template baseline
  const handleReset = () => {
    if (confirm("Are you sure you want to reset this character sheet? All current edits will be cleared.")) {
      setState(DEFAULT_CHAR());
      setRollOutputs({
        oneDx: "",
        fullDx: "",
        hit: "",
        resist: "",
        init: "",
        summon: ""
      });
      localStorage.removeItem("cypheric_character");
    }
  };

  // Derived Totals
  const hmTotal = state.thaumagen.hm.sub + state.thaumagen.hm.data + state.thaumagen.hm.sync;
  const snTotal = state.thaumagen.sn.sub + state.thaumagen.sn.data + state.thaumagen.sn.sync;
  const wlTotal = state.thaumagen.wl.sub + state.thaumagen.wl.data + state.thaumagen.wl.sync;

  const LIST_ICON = { matrices: "⚡", merits: "✦", items: "🜲", summons: "✧" };

  return (
    <div className={`min-h-screen bg-void text-ink pb-24 transition-all duration-300 ${sidebarOpen ? "md:pl-[380px]" : "pl-0"}`}>
      {/* Floating Toggle for Runic Dice Engine Sidebar */}
      <button 
        id="sidebar-toggle-trigger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-3 bg-[#0d101f]/95 border rounded text-xs font-bold tracking-widest font-cinzel cursor-pointer transition-all duration-300 backdrop-blur-md shadow-2xl ${
          sidebarOpen ? "border-sn text-sn shadow-[0_0_15px_rgba(166,123,242,0.25)]" : "border-panel-line text-wl hover:border-wl hover:text-ink"
        }`}
      >
        <Dices className="w-4 h-4 animate-pulse" />
        <span>{sidebarOpen ? "CLOSE RUNIC ROLLS" : "OPEN RUNIC ROLLS"}</span>
      </button>

      {/* Runic Rolls sliding Sidebar Panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed top-0 left-0 w-[350px] h-full z-40 bg-[#080a14]/95 border-r border-panel-line shadow-[5px_0_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-6 pt-24 overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-panel-line pb-3 mb-6">
              <h2 className="text-base text-wl uppercase tracking-widest font-cinzel">DICE ROLLS ENGINE</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-ink-dim hover:text-danger hover:bg-danger/10 p-1.5 rounded transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Roll 1dx */}
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => handleRoll("oneDx")}
                  className="w-full text-left font-cinzel text-xs font-semibold uppercase border border-panel-line rounded p-3 bg-panel-alt hover:bg-sn/10 hover:border-sn text-ink hover:text-sn shadow-md transition-all duration-150 cursor-pointer"
                >
                  Roll 1d{groupData.sides}
                </button>
                <div className="flex gap-1.5">
                  <div className={`flex-1 min-h-[38px] flex items-center px-3.5 py-2 border rounded font-mono text-xs ${rollOutputs.oneDx ? "text-ink border-wl/40 bg-[#0e1121]/70" : "text-ink-dim/50 border-panel-line bg-void/50"}`}>
                    {rollOutputs.oneDx ? (
                      <span dangerouslySetInnerHTML={{ __html: rollOutputs.oneDx.replace(/\[(.*?)\]/, '<span class="text-wl font-bold text-sm">$1</span>') }} />
                    ) : "—"}
                  </div>
                  <button 
                    onClick={() => handleClearRoll("oneDx")}
                    disabled={!rollOutputs.oneDx}
                    className="flex-none w-10 h-10 border border-panel-line rounded flex items-center justify-center text-ink-dim hover:text-danger hover:border-danger hover:bg-danger/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Roll Full dx */}
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => handleRoll("fullDx")}
                  className="w-full text-left font-cinzel text-xs font-semibold uppercase border border-panel-line rounded p-3 bg-panel-alt hover:bg-sn/10 hover:border-sn text-ink hover:text-sn shadow-md transition-all duration-150 cursor-pointer"
                >
                  Roll Full dx ({groupData.dice})
                </button>
                <div className="flex gap-1.5">
                  <div className={`flex-1 min-h-[38px] flex items-center px-3.5 py-2 border rounded font-mono text-xs ${rollOutputs.fullDx ? "text-ink border-wl/40 bg-[#0e1121]/70" : "text-ink-dim/50 border-panel-line bg-void/50"}`}>
                    {rollOutputs.fullDx ? (
                      <span dangerouslySetInnerHTML={{ __html: rollOutputs.fullDx.replace(/=\s*(.*?)$/, '= <span class="text-wl font-bold text-sm">$1</span>') }} />
                    ) : "—"}
                  </div>
                  <button 
                    onClick={() => handleClearRoll("fullDx")}
                    disabled={!rollOutputs.fullDx}
                    className="flex-none w-10 h-10 border border-panel-line rounded flex items-center justify-center text-ink-dim hover:text-danger hover:border-danger hover:bg-danger/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Roll Hit */}
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => handleRoll("hit")}
                  className="w-full text-left font-cinzel text-xs font-semibold uppercase border border-panel-line rounded p-3 bg-panel-alt hover:bg-sn/10 hover:border-sn text-ink hover:text-sn shadow-md transition-all duration-150 cursor-pointer"
                >
                  Roll to Hit (1d{groupData.sides} + Ability)
                </button>
                <div className="flex gap-1.5">
                  <div className={`flex-1 min-h-[38px] flex items-center px-3.5 py-2 border rounded font-mono text-xs ${rollOutputs.hit ? "text-ink border-wl/40 bg-[#0e1121]/70" : "text-ink-dim/50 border-panel-line bg-void/50"}`}>
                    {rollOutputs.hit ? (
                      <span dangerouslySetInnerHTML={{ __html: rollOutputs.hit.replace(/=\s*(.*?)$/, '= <span class="text-wl font-bold text-sm">$1</span>') }} />
                    ) : "—"}
                  </div>
                  <button 
                    onClick={() => handleClearRoll("hit")}
                    disabled={!rollOutputs.hit}
                    className="flex-none w-10 h-10 border border-panel-line rounded flex items-center justify-center text-ink-dim hover:text-danger hover:border-danger hover:bg-danger/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Roll Resist */}
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => handleRoll("resist")}
                  className="w-full text-left font-cinzel text-xs font-semibold uppercase border border-panel-line rounded p-3 bg-panel-alt hover:bg-sn/10 hover:border-sn text-ink hover:text-sn shadow-md transition-all duration-150 cursor-pointer"
                >
                  Roll to Resist (1d{groupData.sides} + Ability)
                </button>
                <div className="flex gap-1.5">
                  <div className={`flex-1 min-h-[38px] flex items-center px-3.5 py-2 border rounded font-mono text-xs ${rollOutputs.resist ? "text-ink border-wl/40 bg-[#0e1121]/70" : "text-ink-dim/50 border-panel-line bg-void/50"}`}>
                    {rollOutputs.resist ? (
                      <span dangerouslySetInnerHTML={{ __html: rollOutputs.resist.replace(/=\s*(.*?)$/, '= <span class="text-wl font-bold text-sm">$1</span>') }} />
                    ) : "—"}
                  </div>
                  <button 
                    onClick={() => handleClearRoll("resist")}
                    disabled={!rollOutputs.resist}
                    className="flex-none w-10 h-10 border border-panel-line rounded flex items-center justify-center text-ink-dim hover:text-danger hover:border-danger hover:bg-danger/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Initiative */}
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => handleRoll("init")}
                  className="w-full text-left font-cinzel text-xs font-semibold uppercase border border-panel-line rounded p-3 bg-panel-alt hover:bg-sn/10 hover:border-sn text-ink hover:text-sn shadow-md transition-all duration-150 cursor-pointer"
                >
                  Initiative (Ability + 1d{groupData.sides})
                </button>
                <div className="flex gap-1.5">
                  <div className={`flex-1 min-h-[38px] flex items-center px-3.5 py-2 border rounded font-mono text-xs ${rollOutputs.init ? "text-ink border-wl/40 bg-[#0e1121]/70" : "text-ink-dim/50 border-panel-line bg-void/50"}`}>
                    {rollOutputs.init ? (
                      <span dangerouslySetInnerHTML={{ __html: rollOutputs.init.replace(/=\s*(.*?)$/, '= <span class="text-wl font-bold text-sm">$1</span>') }} />
                    ) : "—"}
                  </div>
                  <button 
                    onClick={() => handleClearRoll("init")}
                    disabled={!rollOutputs.init}
                    className="flex-none w-10 h-10 border border-panel-line rounded flex items-center justify-center text-ink-dim hover:text-danger hover:border-danger hover:bg-danger/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Summon Actions Tracker */}
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="text-[10px] tracking-wider uppercase font-cinzel text-ink-dim font-bold border border-panel-line rounded px-3 py-2 bg-void/40">
                  SUMMON ACTIONS TRACKER
                </div>
                <div className="flex gap-1.5">
                  <div className={`flex-1 min-h-[50px] flex items-center px-3.5 py-2 border rounded font-mono text-xs leading-relaxed ${rollOutputs.summon ? "text-ink border-[#a67bf2]/40 bg-[#120e24]/70" : "text-ink-dim/50 border-panel-line bg-void/50"}`}>
                    {rollOutputs.summon ? (
                      <span dangerouslySetInnerHTML={{ __html: rollOutputs.summon.replace(/=\s*(.*?)$/, '= <span class="text-sn font-bold text-sm">$1</span>') }} />
                    ) : "No summon action rolled yet. Click 'Roll Thauma' inside any Summon details card to trigger dynamic calculations."}
                  </div>
                  <button 
                    onClick={() => handleClearRoll("summon")}
                    disabled={!rollOutputs.summon}
                    className="flex-none w-10 border border-panel-line rounded flex items-center justify-center text-ink-dim hover:text-danger hover:border-danger hover:bg-danger/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="wrap px-4 pt-16">
        {/* MASTHEAD HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-8 pb-7 mb-9 border-b border-panel-line relative">
          <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-wl to-transparent" />
          
          {/* Central Tier Group Sigil */}
          <div 
            style={{ 
              boxShadow: `0 0 20px rgba(0,0,0,0.8), 0 0 0 4px rgba(6,7,13,1), 0 0 0 5px ${groupData.seal}4d`
            }}
            className="relative w-28 h-28 flex-none rounded-full flex items-center justify-center text-center font-cinzel text-[9px] font-bold tracking-wider text-ink bg-gradient-to-b from-void via-[#161a30]/40 to-void border border-panel-line transition-transform duration-500 hover:rotate-45 group cursor-pointer"
          >
            <div className="absolute inset-1 border border-dashed border-ink-dim/30 rounded-full" />
            <span className="bg-[#06070d]/95 text-ink border border-gold-line py-1.5 px-2 max-w-[96px] break-words leading-tight shadow-2xl -rotate-45 transition-transform duration-500 group-hover:rotate-0">
              {state.tierLevel}
            </span>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-cinzel font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-ink to-ink-dim uppercase">
              CYPHERIC MADNESS
            </h1>
            <div className="text-wl font-mono text-xs tracking-[0.2em] uppercase mt-1.5">
              Omniversal Character Ledger
            </div>
          </div>

          {/* Interactive Character and Loader Toolbar */}
          <div className="flex flex-wrap gap-5 items-end justify-center md:justify-end">
            <div>
              <label className="block font-cinzel text-[10px] tracking-widest text-ink-dim uppercase mb-1.5">
                Character Name
              </label>
              <input 
                type="text" 
                value={state.name}
                onChange={(e) => setState((prev) => ({ ...prev, name: e.target.value }))}
                className="w-52 max-w-full font-spectral text-sm bg-[#0e1121]/80 border border-panel-line text-ink rounded px-3 py-2 outline-none shadow-inner focus:border-wl focus:shadow-[0_0_8px_rgba(64,203,211,0.15)] transition-all"
                placeholder="E.g. Void Traveler"
              />
            </div>

            <div>
              <label className="block font-cinzel text-[10px] tracking-widest text-ink-dim uppercase mb-1.5">
                Set Macro Baseline
              </label>
              <select 
                value={state.tierLevel}
                onChange={(e) => {
                  if (e.target.value) applyTierMacroBaseline(e.target.value);
                }}
                className="font-mono text-xs bg-[#0e1121]/80 border border-panel-line text-ink rounded px-3 py-2 outline-none shadow-inner focus:border-wl focus:shadow-[0_0_8px_rgba(64,203,211,0.15)] transition-all cursor-pointer"
              >
                <option value="" disabled>— Select Baseline —</option>
                {TIER_LEVELS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.statPoints} pts)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2.5">
              {/* Standalone HTML File Exporter */}
              <button 
                onClick={exportAsStandaloneHtml}
                title="Download Standalone Offline HTML Character Sheet"
                className="bg-[#5c451a]/40 border border-hm text-hm font-cinzel text-[10px] tracking-wider uppercase px-4 py-2.5 rounded h-[38px] cursor-pointer hover:bg-hm hover:text-void hover:shadow-[0_0_15px_rgba(226,179,76,0.4)] transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SAVE STANDALONE</span>
              </button>

              {/* JSON Data Backup */}
              <button 
                onClick={exportAsJson}
                title="Download JSON Data Backup"
                className="bg-[#0e1121]/40 border border-panel-line text-ink-dim font-cinzel text-[10px] tracking-wider uppercase px-4 py-2.5 rounded h-[38px] cursor-pointer hover:border-sn hover:text-sn hover:bg-sn/10 transition-all flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>

              {/* Loader Button */}
              <label className="bg-[#161a30]/40 border border-panel-line text-wl font-cinzel text-[10px] tracking-wider uppercase px-4 py-2.5 rounded h-[38px] cursor-pointer hover:border-wl hover:text-ink hover:bg-wl/10 transition-all flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>IMPORT</span>
                <input 
                  type="file" 
                  accept=".html,.json" 
                  onChange={handleFileInputChange} 
                  className="hidden" 
                />
              </label>

              {/* Sheet Reset */}
              <button 
                onClick={handleReset}
                title="Reset Sheet to Mortal Baseline"
                className="border border-danger/30 text-danger/70 hover:border-danger hover:text-danger hover:bg-danger/10 font-cinzel text-[10px] tracking-wider uppercase p-2 rounded h-[38px] cursor-pointer transition-all flex items-center justify-center"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* STATS AND CHARACTER WORKSPACE */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* PLAYER STATS PANEL */}
          <div className="panel relative bg-panel border border-panel-line rounded p-6 shadow-2xl backdrop-blur-md">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-ink-dim/30" />
            <h2 className="text-base font-cinzel font-bold text-ink uppercase mb-5 flex items-center gap-3.5 after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-panel-line after:to-transparent">
              Player Stats
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Harmonics (HM) */}
              <div className="border border-panel-line rounded p-4.5 bg-panel-alt relative overflow-hidden flex flex-col justify-between">
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-hm" />
                <div>
                  <div className="font-cinzel text-xs tracking-wider uppercase font-bold text-hm text-shadow-glow">
                    Harmonics
                  </div>
                  <div className="text-xs text-ink-dim italic mt-1.5 leading-relaxed min-h-[34px]">
                    Energetic & physical stability. Favors Ability. Roll to Resist.
                  </div>
                </div>
                <input 
                  type="number" 
                  value={state.hm}
                  onChange={(e) => handleStatChange("hm", Number(e.target.value) || 0)}
                  min="0"
                  className="w-full mt-4 font-mono text-xl text-center font-bold bg-[#06070d]/50 border border-panel-line py-2 rounded focus:border-hm outline-none"
                />
              </div>

              {/* Sanity (SN) */}
              <div className="border border-panel-line rounded p-4.5 bg-panel-alt relative overflow-hidden flex flex-col justify-between">
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-sn" />
                <div>
                  <div className="font-cinzel text-xs tracking-wider uppercase font-bold text-sn text-shadow-glow">
                    Sanity
                  </div>
                  <div className="text-xs text-ink-dim italic mt-1.5 leading-relaxed min-h-[34px]">
                    Strength of will, awareness of the Cypher. Favors Thauma. Summoning.
                  </div>
                </div>
                <input 
                  type="number" 
                  value={state.sn}
                  onChange={(e) => handleStatChange("sn", Number(e.target.value) || 0)}
                  min="0"
                  className="w-full mt-4 font-mono text-xl text-center font-bold bg-[#06070d]/50 border border-panel-line py-2 rounded focus:border-sn outline-none"
                />
              </div>

              {/* Wavelength (WL) */}
              <div className="border border-panel-line rounded p-4.5 bg-panel-alt relative overflow-hidden flex flex-col justify-between">
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-wl" />
                <div>
                  <div className="font-cinzel text-xs tracking-wider uppercase font-bold text-wl text-shadow-glow">
                    Wavelength
                  </div>
                  <div className="text-xs text-ink-dim italic mt-1.5 leading-relaxed min-h-[34px]">
                    Raw power, projection of will. Favors Health. Roll to Hit.
                  </div>
                </div>
                <input 
                  type="number" 
                  value={state.wl}
                  onChange={(e) => handleStatChange("wl", Number(e.target.value) || 0)}
                  min="0"
                  className="w-full mt-4 font-mono text-xl text-center font-bold bg-[#06070d]/50 border border-panel-line py-2 rounded focus:border-wl outline-none"
                />
              </div>
            </div>

            <div className={`mt-4 font-mono text-xs flex flex-col md:flex-row justify-between gap-2 bg-[#06070d]/40 px-4 py-3 border rounded border-panel-line ${isPointsOver ? "border-danger/50 text-danger" : "text-ink-dim"}`}>
              <span>
                Thaumagen Used: <b className={isPointsOver ? "text-danger" : "text-wl"}>{state.hm}/{hmTotal}</b> HM · <b className={isPointsOver ? "text-danger" : "text-wl"}>{state.sn}/{snTotal}</b> SN · <b className={isPointsOver ? "text-danger" : "text-wl"}>{state.wl}/{wlTotal}</b> WL 
                {isPointsOver && <span className="ml-2 font-bold">(Exceeds Assigned Limits!)</span>}
              </span>
              <span>
                Active Aspect: <b className="text-wl uppercase font-bold">{aspect}</b>
              </span>
            </div>
          </div>

          {/* DERIVED STATS PANEL */}
          <div className="panel relative bg-panel border border-panel-line rounded p-6 shadow-2xl backdrop-blur-md">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-ink-dim/30" />
            <h2 className="text-base font-cinzel font-bold text-ink uppercase mb-5 flex items-center gap-3.5 after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-panel-line after:to-transparent">
              Derived Stats
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {/* Thauma spent/max tracker */}
              <div 
                onClick={() => setAdjustingTracker("thauma")}
                className="bg-panel-alt border border-panel-line rounded p-3.5 relative cursor-pointer hover:border-wl hover:bg-[#2a3054]/50 hover:-translate-y-0.5 transition-all duration-150"
                title="Click to expend or adjust Thauma"
              >
                <div className="font-cinzel text-[10px] tracking-wider text-ink-dim uppercase flex items-center gap-1 justify-between">
                  <span>Thauma ✎</span>
                  <Activity className="w-3.5 h-3.5 text-sn" />
                </div>
                <div className="font-mono text-lg font-bold text-ink mt-1.5">
                  {state.currentThauma ?? maxThauma} / {maxThauma}
                </div>
                <div className="text-[10px] font-mono text-ink-dim/60 mt-1">
                  threshold {tierData.thauma}
                </div>
              </div>

              {/* Health current/max tracker */}
              <div 
                onClick={() => setAdjustingTracker("health")}
                className="bg-panel-alt border border-panel-line rounded p-3.5 relative cursor-pointer hover:border-wl hover:bg-[#2a3054]/50 hover:-translate-y-0.5 transition-all duration-150"
                title="Click to log damage or adjust Health"
              >
                <div className="font-cinzel text-[10px] tracking-wider text-ink-dim uppercase flex items-center gap-1 justify-between">
                  <span>Health ✎</span>
                  <Heart className="w-3.5 h-3.5 text-danger" />
                </div>
                <div className="font-mono text-lg font-bold text-ink mt-1.5">
                  {state.currentHealth ?? maxHealth} / {maxHealth}
                </div>
                <div className="text-[10px] font-mono text-ink-dim/60 mt-1">
                  base {tierData.health}
                </div>
              </div>

              {/* Ability */}
              <div className="bg-panel-alt border border-panel-line rounded p-3.5 relative">
                <div className="font-cinzel text-[10px] tracking-wider text-ink-dim uppercase flex items-center gap-1 justify-between">
                  <span>Ability</span>
                  <Shield className="w-3.5 h-3.5 text-hm" />
                </div>
                <div className="font-mono text-lg font-bold text-ink mt-1.5">
                  {ability}
                </div>
                <div className="text-[10px] font-mono text-ink-dim/60 mt-1">
                  ref {tierData.ability}
                </div>
              </div>

              {/* Dice */}
              <div className="bg-panel-alt border border-panel-line rounded p-3.5 relative">
                <div className="font-cinzel text-[10px] tracking-wider text-ink-dim uppercase flex items-center gap-1 justify-between">
                  <span>Dice (dx)</span>
                  <Dices className="w-3.5 h-3.5 text-wl" />
                </div>
                <div className="font-mono text-lg font-bold text-ink mt-1.5">
                  {groupData.dice}
                </div>
                <div className="text-[10px] font-mono text-ink-dim/60 mt-1">
                  dx Total {groupData.n * groupData.sides}
                </div>
              </div>

              {/* Tier Bonus */}
              <div className="bg-panel-alt border border-panel-line rounded p-3.5 relative">
                <div className="font-cinzel text-[10px] tracking-wider text-ink-dim uppercase flex items-center gap-1 justify-between">
                  <span>Tier Bonus</span>
                  <Star className="w-3.5 h-3.5 text-hm" />
                </div>
                <div className="font-mono text-lg font-bold text-ink mt-1.5">
                  {groupData.tierBonus}
                </div>
                <div className="text-[10px] font-mono text-ink-dim/60 mt-1">
                  multicast slots
                </div>
              </div>

              {/* Equip Limit */}
              <div className="bg-panel-alt border border-panel-line rounded p-3.5 relative">
                <div className="font-cinzel text-[10px] tracking-wider text-ink-dim uppercase flex items-center gap-1 justify-between">
                  <span>Equip Limit</span>
                  <Sparkles className="w-3.5 h-3.5 text-sn" />
                </div>
                <div className="font-mono text-lg font-bold text-ink mt-1.5">
                  {groupData.equipLimit}
                </div>
                <div className="text-[10px] font-mono text-ink-dim/60 mt-1">
                  items / summons
                </div>
              </div>
            </div>

            {/* Health modifiers field */}
            <div className="mt-5">
              <label className="block font-cinzel text-[10px] tracking-wider text-ink-dim uppercase mb-1.5">
                Additional Merit / Item Health Modifications
              </label>
              <input 
                type="number" 
                value={state.flatHealthBonus} 
                onChange={(e) => setState((prev) => ({ ...prev, flatHealthBonus: Number(e.target.value) || 0 }))}
                className="w-36 font-mono text-sm bg-[#06070d]/50 border border-panel-line text-ink rounded px-3 py-1.5 outline-none focus:border-wl"
              />
            </div>
          </div>

          {/* THAUMAGEN BANK */}
          <div className="panel relative bg-panel border border-panel-line rounded p-6 shadow-2xl backdrop-blur-md">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-ink-dim/30" />
            <h2 className="text-base font-cinzel font-bold text-ink uppercase mb-5 flex items-center gap-3.5 after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-panel-line after:to-transparent">
              Thaumagen Bank
            </h2>

            <div className="bank-grid text-sm font-mono grid grid-cols-[80px_1fr_1fr_1fr] gap-x-4 gap-y-3 items-center">
              <div />
              <div className="text-center font-cinzel text-[10px] tracking-widest text-ink-dim uppercase pb-1.5 font-bold">Substrate</div>
              <div className="text-center font-cinzel text-[10px] tracking-widest text-ink-dim uppercase pb-1.5 font-bold">Data</div>
              <div className="text-center font-cinzel text-[10px] tracking-widest text-ink-dim uppercase pb-1.5 font-bold">Sync</div>

              {/* Harmonics row */}
              <div className="font-cinzel text-xs tracking-wider uppercase text-hm font-semibold text-shadow-glow">HM</div>
              <input 
                type="number" 
                value={state.thaumagen.hm.sub} 
                onChange={(e) => handleBankChange("hm", "sub", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />
              <input 
                type="number" 
                value={state.thaumagen.hm.data} 
                onChange={(e) => handleBankChange("hm", "data", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />
              <input 
                type="number" 
                value={state.thaumagen.hm.sync} 
                onChange={(e) => handleBankChange("hm", "sync", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />

              {/* Sanity row */}
              <div className="font-cinzel text-xs tracking-wider uppercase text-sn font-semibold text-shadow-glow">SN</div>
              <input 
                type="number" 
                value={state.thaumagen.sn.sub} 
                onChange={(e) => handleBankChange("sn", "sub", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />
              <input 
                type="number" 
                value={state.thaumagen.sn.data} 
                onChange={(e) => handleBankChange("sn", "data", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />
              <input 
                type="number" 
                value={state.thaumagen.sn.sync} 
                onChange={(e) => handleBankChange("sn", "sync", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />

              {/* Wavelength row */}
              <div className="font-cinzel text-xs tracking-wider uppercase text-wl font-semibold text-shadow-glow">WL</div>
              <input 
                type="number" 
                value={state.thaumagen.wl.sub} 
                onChange={(e) => handleBankChange("wl", "sub", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />
              <input 
                type="number" 
                value={state.thaumagen.wl.data} 
                onChange={(e) => handleBankChange("wl", "data", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />
              <input 
                type="number" 
                value={state.thaumagen.wl.sync} 
                onChange={(e) => handleBankChange("wl", "sync", Number(e.target.value) || 0)}
                className="text-center bg-[#06070d]/60 border border-panel-line py-2 text-ink rounded outline-none focus:border-wl font-bold"
              />
            </div>
          </div>

          {/* MATRICES PANEL */}
          {renderListSection("Matrices", "matrices", ["name", "tags", "area", "aspect"], state.matrices.length > 7, 7)}

          {/* MERITS PANEL */}
          {renderListSection("Merits", "merits", ["name"])}

          {/* MANTLES PANEL */}
          <div className="panel relative bg-panel border border-panel-line rounded p-6 shadow-2xl backdrop-blur-md">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-ink-dim/30" />
            <h2 className="text-base font-cinzel font-bold text-ink uppercase mb-5 flex items-center gap-3.5 after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-panel-line after:to-transparent">
              Mantles
            </h2>

            <div className="flex flex-col gap-3">
              {state.mantles.map((mantle, mIdx) => (
                <div key={mIdx}>
                  {mantle.isEditing ? (
                    <div className="entry bg-panel-alt border border-hm/70 rounded p-4 relative">
                      <div className="flex gap-2.5 items-center mb-4">
                        <input 
                          type="text" 
                          placeholder="Mantle Name" 
                          value={mantle.name}
                          onChange={(e) => handleUpdateMantleName(mIdx, e.target.value)}
                          className="flex-1 font-spectral text-base bg-[#06070d]/40 border border-panel-line text-ink rounded px-3 py-1.5 focus:border-hm outline-none"
                        />
                        <button 
                          onClick={() => handleMantleToggleState(mIdx, "isEditing", false)}
                          className="flex-none bg-hm-dim/80 border border-hm text-ink font-cinzel text-[10px] tracking-wide uppercase px-3 py-2 rounded transition-all cursor-pointer"
                        >
                          Lock & Minimize
                        </button>
                        <button 
                          onClick={() => handleDeleteMantle(mIdx)}
                          className="flex-none text-ink-dim hover:text-danger hover:bg-danger/10 p-2 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Passive Effects */}
                      <div className="mb-4">
                        <h4 className="font-cinzel text-[10px] tracking-widest text-ink-dim uppercase border-b border-dashed border-panel-line pb-1 mb-2 font-semibold">
                          Mantle Effects
                        </h4>
                        <div className="flex flex-col gap-2">
                          {(mantle.effects || []).map((eff, eIdx) => (
                            <div key={eIdx} className="bg-void/40 border border-dashed border-panel-line p-3 rounded flex flex-col gap-2 relative">
                              <input 
                                type="text" 
                                placeholder="Trigger Name" 
                                value={eff.name}
                                onChange={(e) => handleUpdateMantleEffect(mIdx, eIdx, "name", e.target.value)}
                                className="w-full bg-[#06070d]/50 border border-panel-line rounded px-2.5 py-1 text-sm font-bold text-ink outline-none focus:border-wl"
                              />
                              <textarea 
                                placeholder="Effect description..." 
                                value={eff.effect}
                                onChange={(e) => handleUpdateMantleEffect(mIdx, eIdx, "effect", e.target.value)}
                                className="w-full h-16 bg-[#06070d]/50 border border-panel-line rounded p-2 text-xs text-ink outline-none focus:border-wl resize-y font-spectral"
                              />
                              <button 
                                onClick={() => handleDeleteMantleEffect(mIdx, eIdx)}
                                className="text-ink-dim hover:text-danger text-xs font-cinzel font-semibold uppercase flex items-center gap-1 cursor-pointer"
                              >
                                Remove Effect
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => handleAddMantleEffect(mIdx)}
                            className="bg-transparent border border-dashed border-panel-line text-ink-dim hover:border-wl hover:text-wl text-[10px] tracking-wider uppercase py-2 rounded transition-all font-cinzel cursor-pointer"
                          >
                            + Add Passive Effect
                          </button>
                        </div>
                      </div>

                      {/* Embedded Matrices */}
                      <div>
                        <h4 className="font-cinzel text-[10px] tracking-widest text-ink-dim uppercase border-b border-dashed border-panel-line pb-1 mb-2 font-semibold">
                          Embedded Matrices
                        </h4>
                        <div className="flex flex-col gap-2">
                          {(mantle.matrices || []).map((mat, matIdx) => (
                            <div key={matIdx} className="bg-void/40 border border-panel-line p-3 rounded flex flex-col gap-2 relative">
                              <div className="grid grid-cols-3 gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Matrix Name" 
                                  value={mat.name}
                                  onChange={(e) => handleUpdateMantleMatrix(mIdx, matIdx, "name", e.target.value)}
                                  className="col-span-1.5 bg-[#06070d]/50 border border-panel-line rounded px-2.5 py-1 text-xs text-ink font-bold outline-none focus:border-wl"
                                />
                                <input 
                                  type="text" 
                                  placeholder="Tags" 
                                  value={mat.tags || ""}
                                  onChange={(e) => handleUpdateMantleMatrix(mIdx, matIdx, "tags", e.target.value)}
                                  className="col-span-0.75 bg-[#06070d]/50 border border-panel-line rounded px-2.5 py-1 text-xs text-ink outline-none focus:border-wl"
                                />
                                <input 
                                  type="text" 
                                  placeholder="Aspect" 
                                  value={mat.aspect || ""}
                                  onChange={(e) => handleUpdateMantleMatrix(mIdx, matIdx, "aspect", e.target.value)}
                                  className="col-span-0.75 bg-[#06070d]/50 border border-panel-line rounded px-2.5 py-1 text-xs text-ink outline-none focus:border-wl"
                                />
                              </div>
                              <textarea 
                                placeholder="Logic Chain / Rules..." 
                                value={mat.effect}
                                onChange={(e) => handleUpdateMantleMatrix(mIdx, matIdx, "effect", e.target.value)}
                                className="w-full h-16 bg-[#06070d]/50 border border-panel-line rounded p-2 text-xs text-ink outline-none focus:border-wl resize-y font-spectral"
                              />
                              <button 
                                onClick={() => handleDeleteMantleMatrix(mIdx, matIdx)}
                                className="text-ink-dim hover:text-danger text-xs font-cinzel font-semibold uppercase flex items-center gap-1 cursor-pointer"
                              >
                                Remove Matrix
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => handleAddMantleMatrix(mIdx)}
                            className="bg-transparent border border-dashed border-panel-line text-ink-dim hover:border-wl hover:text-wl text-[10px] tracking-wider uppercase py-2 rounded transition-all font-cinzel cursor-pointer"
                          >
                            + Embed Matrix
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <button 
                        onClick={() => handleMantleToggleState(mIdx, "isOpen", !mantle.isOpen)}
                        className="w-full text-left bg-panel-alt border border-panel-line text-ink py-3 px-4 rounded font-cinzel text-sm cursor-pointer hover:border-hm hover:bg-[#e2b34c]/5 transition-all flex justify-between items-center"
                      >
                        <span className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-hm animate-pulse" />
                          <span>💎 {mantle.name || "Unnamed Mantle"}</span>
                        </span>
                        <span className="text-[10px] text-ink-dim tracking-wider font-mono">
                          {mantle.isOpen ? "▲ Collapse" : "▼ Expand"}
                        </span>
                      </button>

                      {mantle.isOpen && (
                        <div className="bg-[#0e1121]/90 border border-t-0 border-panel-line p-5 rounded-b shadow-inner">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-mono text-xs text-hm font-bold">
                              Matrices Bound: {(mantle.matrices || []).length}
                            </span>
                            <button 
                              onClick={() => handleMantleToggleState(mIdx, "isEditing", true)}
                              className="text-xs text-ink hover:text-wl border border-panel-line hover:border-wl bg-transparent px-3 py-1 rounded cursor-pointer transition-all flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Layout</span>
                            </button>
                          </div>

                          {/* Passives Tab buttons */}
                          <div className="mb-4">
                            <h4 className="font-cinzel text-[10px] tracking-widest text-ink-dim uppercase border-b border-dashed border-panel-line pb-1 mb-2 font-bold">
                              Passive Effects
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {(mantle.effects || []).map((eff, eIdx) => {
                                const tabKey = `eff_${eIdx}`;
                                const isActive = activeMantleTabs[mIdx] === tabKey;
                                return (
                                  <button 
                                    key={eIdx}
                                    onClick={() => setActiveMantleTabs((prev) => ({
                                      ...prev,
                                      [mIdx]: isActive ? null : tabKey
                                    }))}
                                    className={`font-spectral text-xs px-3.5 py-2 rounded border cursor-pointer transition-all ${
                                      isActive 
                                        ? "bg-hm-dim/35 border-hm text-hm shadow-[0_0_8px_rgba(226,179,76,0.15)]" 
                                        : "bg-[#06070d]/50 border-panel-line text-ink-dim hover:text-ink hover:border-ink-dim"
                                    }`}
                                  >
                                    {eff.name || "Unnamed Effect"}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Component Matrices Tab buttons */}
                          <div className="mb-4">
                            <h4 className="font-cinzel text-[10px] tracking-widest text-ink-dim uppercase border-b border-dashed border-panel-line pb-1 mb-2 font-bold">
                              Component Matrices
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {(mantle.matrices || []).map((mat, matIdx) => {
                                const tabKey = `mat_${matIdx}`;
                                const isActive = activeMantleTabs[mIdx] === tabKey;
                                return (
                                  <button 
                                    key={matIdx}
                                    onClick={() => setActiveMantleTabs((prev) => ({
                                      ...prev,
                                      [mIdx]: isActive ? null : tabKey
                                    }))}
                                    className={`font-spectral text-xs px-3.5 py-2 rounded border cursor-pointer transition-all flex items-center gap-1.5 ${
                                      isActive 
                                        ? "bg-hm-dim/35 border-hm text-hm shadow-[0_0_8px_rgba(226,179,76,0.15)]" 
                                        : "bg-[#06070d]/50 border-panel-line text-ink-dim hover:text-ink hover:border-ink-dim"
                                    }`}
                                  >
                                    <Sparkle className="w-3.5 h-3.5" />
                                    <span>{mat.name || "Unnamed Matrix"}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Render Popdown Details Panel */}
                          {activeMantleTabs[mIdx] && (
                            <div className="mt-3">
                              {(() => {
                                const [type, idxStr] = (activeMantleTabs[mIdx] || "").split("_");
                                const idx = parseInt(idxStr, 10);
                                if (type === "eff") {
                                  const eff = mantle.effects[idx];
                                  if (!eff) return null;
                                  return (
                                    <div className="bg-[#06070d]/60 border-l-[3px] border-hm p-4 rounded-r shadow-inner">
                                      <div className="font-bold text-sm text-hm mb-1">{eff.name || "Unnamed Effect"}</div>
                                      <p className="text-xs leading-relaxed text-ink/90 whitespace-pre-wrap">{eff.effect || "No description parameter."}</p>
                                    </div>
                                  );
                                } else if (type === "mat") {
                                  const mat = mantle.matrices[idx];
                                  if (!mat) return null;
                                  return (
                                    <div className="bg-[#06070d]/60 border-l-[3px] border-wl p-4 rounded-r shadow-inner">
                                      <div className="flex flex-wrap items-center gap-x-2.5 mb-1.5">
                                        <div className="font-bold text-sm text-wl">{mat.name || "Unnamed Matrix"}</div>
                                        <div className="text-[10px] text-ink-dim font-mono tracking-wider bg-panel/40 border border-panel-line px-1.5 py-0.5 rounded">
                                          Tags: [{mat.tags || "None"}] | Aspect: {mat.aspect || "None"}
                                        </div>
                                      </div>
                                      <p className="text-xs leading-relaxed text-ink/90 whitespace-pre-wrap">{mat.effect || "No rules parameters defined."}</p>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddMantle}
              className="mt-4 flex items-center gap-1.5 font-cinzel text-[10px] tracking-wider uppercase bg-transparent border border-dashed border-panel-line text-ink-dim hover:border-wl hover:text-wl py-3 px-5 rounded cursor-pointer transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mantle</span>
            </button>
          </div>

          {/* ITEMS PANEL */}
          {renderListSection("Items", "items", ["name", "aspect"], state.items.length > groupData.equipLimit, groupData.equipLimit)}

          {/* SUMMONS PANEL */}
          {renderListSection("Summons", "summons", ["name", "aspect"], state.summons.length > groupData.equipLimit, groupData.equipLimit)}

        </div>
      </div>

      {/* TRACKER ADJUSTMENT POPUP DIALOG */}
      {adjustingTracker && (
        <div className="fixed inset-0 bg-void/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0d101f] border border-panel-line rounded max-w-sm w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => {
                setTrackerAdjustInput("");
                setAdjustingTracker(null);
              }}
              className="absolute top-4 right-4 text-ink-dim hover:text-ink cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-cinzel text-sm font-semibold uppercase tracking-wider text-ink mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-wl animate-pulse" />
              <span>Modify {adjustingTracker === "thauma" ? "Thauma Points" : "Health Tracker"}</span>
            </h3>

            <div className="text-xs text-ink-dim mb-4 leading-relaxed">
              Current: <b className="text-ink font-mono">{adjustingTracker === "thauma" ? (state.currentThauma ?? maxThauma) : (state.currentHealth ?? maxHealth)} / {adjustingTracker === "thauma" ? maxThauma : maxHealth}</b>
              <br />
              Enter an absolute number, or perform operations using mathematical additions/subtractions (e.g. <b>-5</b>, <b>+10</b>):
            </div>

            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                autoFocus
                value={trackerAdjustInput}
                onChange={(e) => setTrackerAdjustInput(e.target.value)}
                placeholder="E.g. -2 or 30"
                className="w-full text-center font-mono text-base bg-[#06070d]/60 border border-panel-line py-2.5 px-3 text-ink rounded outline-none focus:border-wl focus:shadow-[0_0_10px_rgba(64,203,211,0.2)]"
              />

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  onClick={() => {
                    const trimmed = trackerAdjustInput.trim();
                    if (trimmed.startsWith("+") || trimmed.startsWith("-")) {
                      adjustTrackerValue(trimmed.startsWith("+"), trimmed.replace(/[+-]/g, ""));
                    } else {
                      setAbsoluteTrackerValue(trimmed);
                    }
                  }}
                  className="bg-panel-alt hover:bg-wl hover:text-void border border-wl text-wl font-cinzel text-[10px] tracking-wide uppercase py-3 rounded cursor-pointer font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply Change</span>
                </button>
                <button 
                  onClick={() => {
                    setTrackerAdjustInput("");
                    setAdjustingTracker(null);
                  }}
                  className="bg-transparent border border-panel-line text-ink-dim hover:border-danger hover:text-danger hover:bg-danger/10 font-cinzel text-[10px] tracking-wide uppercase py-3 rounded cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>

              {/* Quick Math Shortcuts */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[-10, -5, -1, 1, 5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      adjustTrackerValue(num > 0, Math.abs(num).toString());
                    }}
                    className="bg-[#12162a] border border-panel-line hover:border-sn text-xs font-mono py-1.5 rounded hover:text-sn cursor-pointer text-ink font-semibold transition-all"
                  >
                    {num > 0 ? `+${num}` : num}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      [adjustingTracker === "thauma" ? "currentThauma" : "currentHealth"]: adjustingTracker === "thauma" ? maxThauma : maxHealth
                    }));
                    setTrackerAdjustInput("");
                    setAdjustingTracker(null);
                  }}
                  className="col-span-2 bg-[#12162a] border border-panel-line hover:border-hm text-[10px] font-cinzel uppercase py-1.5 rounded hover:text-hm cursor-pointer text-ink transition-all flex items-center justify-center gap-1"
                  title="Full Restore"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Restore</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper List Render Panel
  function renderListSection(
    title: string, 
    key: "matrices" | "merits" | "items" | "summons", 
    metaFields: string[], 
    isOver = false, 
    limitMax: number | null = null
  ) {
    const list = state[key] as any[];
    const otherFields = metaFields.filter((f) => f !== "name");
    const icon = LIST_ICON[key] || "◆";

    return (
      <div className="panel relative bg-panel border border-panel-line rounded p-6 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-ink-dim/30" />
        <h2 className="text-base font-cinzel font-bold text-ink uppercase mb-5 flex items-center gap-3.5 after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-panel-line after:to-transparent">
          <span className="flex items-center gap-2">
            <span>{title}</span>
            {limitMax !== null && (
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded border ${isOver ? "border-danger text-danger bg-danger/5" : "border-panel-line text-ink-dim bg-void/50"}`}>
                Cap: {list.length}/{limitMax}
              </span>
            )}
          </span>
        </h2>

        <div className="flex flex-col gap-3">
          {list.map((item, idx) => (
            <div key={idx}>
              {item.isEditing ? (
                <div className="entry bg-panel-alt border border-hm/70 rounded p-4 relative">
                  <div className="flex gap-2.5 items-center mb-3">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={item.name}
                      onChange={(e) => handleUpdateListField(key, idx, "name", e.target.value)}
                      className="flex-1 font-spectral text-base bg-[#06070d]/40 border border-panel-line text-ink rounded px-3 py-1.5 focus:border-hm outline-none"
                    />
                    
                    {key === "summons" && (
                      <button 
                        onClick={() => handleRoll("summon", idx.toString())}
                        className="flex-none bg-sn-dim/50 hover:bg-sn hover:text-void border border-sn text-sn font-cinzel text-[10px] tracking-wide uppercase px-3.5 py-2 rounded transition-all cursor-pointer flex items-center gap-1 shadow"
                        title="Roll summon action roll on sidebar tracker"
                      >
                        <Dices className="w-3.5 h-3.5" />
                        <span>Roll Action</span>
                      </button>
                    )}

                    <button 
                      onClick={() => handleDeleteListEntry(key, idx)}
                      className="flex-none text-ink-dim hover:text-danger hover:bg-danger/10 p-2 rounded transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {otherFields.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {otherFields.map((field) => (
                        <div key={field}>
                          <input 
                            type="text" 
                            placeholder={field[0].toUpperCase() + field.slice(1)} 
                            value={item[field] || ""}
                            onChange={(e) => handleUpdateListField(key, idx, field, e.target.value)}
                            className="w-full bg-[#06070d]/30 border border-panel-line text-ink rounded px-2.5 py-1 text-xs outline-none focus:border-wl"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea 
                    placeholder="Effect / description..." 
                    value={item.effect || ""}
                    onChange={(e) => handleUpdateListField(key, idx, "effect", e.target.value)}
                    className="w-full h-18 bg-[#06070d]/50 border border-panel-line text-ink rounded p-2.5 text-xs outline-none focus:border-wl resize-y font-spectral leading-relaxed"
                  />

                  <button 
                    onClick={() => {
                      handleUpdateListField(key, idx, "isEditing", false);
                      handleUpdateListField(key, idx, "isOpen", true);
                    }}
                    className="mt-3 bg-hm-dim/80 border border-hm text-ink font-cinzel text-[10px] tracking-wide uppercase px-4 py-2 rounded cursor-pointer hover:bg-hm hover:text-void transition-all"
                  >
                    Lock & Minimize
                  </button>
                </div>
              ) : (
                <div className="mb-2">
                  <button 
                    onClick={() => handleUpdateListField(key, idx, "isOpen", !item.isOpen)}
                    className="w-full text-left bg-panel-alt border border-panel-line text-ink py-3 px-4 rounded font-cinzel text-sm cursor-pointer hover:border-hm hover:bg-[#e2b34c]/5 transition-all flex justify-between items-center"
                  >
                    <span>{icon} {item.name || "Unnamed"}</span>
                    <span className="text-[10px] text-ink-dim tracking-wider font-mono">
                      {item.isOpen ? "▲ Collapse" : "▼ Expand"}
                    </span>
                  </button>

                  {item.isOpen && (
                    <div className="bg-[#0e1121]/90 border border-t-0 border-panel-line p-5 rounded-b shadow-inner">
                      <div className="flex justify-between items-start gap-3 mb-3.5">
                        <span className="font-mono text-xs text-ink-dim/80">
                          {otherFields.map((field) => `${field[0].toUpperCase() + field.slice(1)}: ${item[field] || "—"}`).join(" · ")}
                        </span>
                        <button 
                          onClick={() => handleUpdateListField(key, idx, "isEditing", true)}
                          className="text-xs text-ink hover:text-wl border border-panel-line hover:border-wl bg-transparent px-3 py-1 rounded cursor-pointer transition-all flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>

                      {key === "summons" && (
                        <button 
                          onClick={() => handleRoll("summon", idx.toString())}
                          className="mb-3 bg-[#12162a]/50 hover:bg-[#a67bf2]/10 hover:text-sn hover:border-sn border border-panel-line text-ink-dim font-cinzel text-[10px] tracking-wide uppercase px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Dices className="w-3.5 h-3.5 text-sn animate-pulse" />
                          <span>Roll summon action</span>
                        </button>
                      )}

                      <p className="margin-0 text-xs text-ink/95 font-spectral whitespace-pre-wrap leading-relaxed">
                        {item.effect || "No description / parameters specified."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={() => handleAddListEntry(key)}
          className="mt-4 flex items-center gap-1.5 font-cinzel text-[10px] tracking-wider uppercase bg-transparent border border-dashed border-panel-line text-ink-dim hover:border-wl hover:text-wl py-3 px-5 rounded cursor-pointer transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Add {title.slice(0, -1)}</span>
        </button>
      </div>
    );
  }
}
