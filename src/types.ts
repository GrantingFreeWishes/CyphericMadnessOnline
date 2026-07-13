export interface ThaumagenBucket {
  sub: number;
  data: number;
  sync: number;
}

export interface Thaumagen {
  hm: ThaumagenBucket;
  sn: ThaumagenBucket;
  wl: ThaumagenBucket;
}

export interface BaseListEntry {
  name: string;
  effect?: string;
  isEditing?: boolean;
  isOpen?: boolean;
}

export interface Matrix extends BaseListEntry {
  tags?: string;
  area?: string;
  aspect?: string;
}

export interface Merit extends BaseListEntry {}

export interface MantleEffect {
  name: string;
  effect: string;
}

export interface MantleMatrix {
  name: string;
  tags?: string;
  area?: string;
  aspect?: string;
  effect: string;
}

export interface Mantle {
  name: string;
  isEditing?: boolean;
  isOpen?: boolean;
  openSubKey?: string | null;
  effects: MantleEffect[];
  matrices: MantleMatrix[];
}

export interface Item extends BaseListEntry {
  aspect?: string;
}

export interface Summon extends BaseListEntry {
  aspect?: string;
}

export interface CharacterState {
  name: string;
  tierLevel: string;
  hm: number;
  sn: number;
  wl: number;
  flatHealthBonus: number;
  currentThauma: number | null;
  currentHealth: number | null;
  thaumagen: Thaumagen;
  matrices: Matrix[];
  merits: Merit[];
  mantles: Mantle[];
  items: Item[];
  summons: Summon[];
}

export interface TierGroup {
  dice: string;
  n: number;
  sides: number;
  tierBonus: number;
  equipLimit: number;
  seal: string;
}

export interface TierLevel {
  name: string;
  group: string;
  thauma: number;
  health: number;
  ability: number;
  statPoints: number;
}
