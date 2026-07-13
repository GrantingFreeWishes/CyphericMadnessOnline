import { TierGroup, TierLevel, CharacterState } from "./types";

export const TIER_GROUPS: Record<string, TierGroup> = {
  Mortal:    { dice: "1d4",  n: 1, sides: 4,  tierBonus: 1, equipLimit: 3, seal: "#e2b34c" },
  Storied:   { dice: "2d6",  n: 2, sides: 6,  tierBonus: 2, equipLimit: 4, seal: "#a67bf2" },
  Honored:   { dice: "3d8",  n: 3, sides: 8,  tierBonus: 3, equipLimit: 5, seal: "#40cbd3" },
  Legendary: { dice: "5d10", n: 5, sides: 10, tierBonus: 5, equipLimit: 6, seal: "#ff5252" },
  Kaleidian: { dice: "7d12", n: 7, sides: 12, tierBonus: 7, equipLimit: 7, seal: "#f2eff7" },
};

export const TIER_LEVELS: TierLevel[] = [
  { name: "Mortal",        group: "Mortal",    thauma: 20,  health: 40,   ability: 4,   statPoints: 15 },
  { name: "Mortal One",    group: "Mortal",    thauma: 25,  health: 45,   ability: 5,   statPoints: 22 },
  { name: "Mortal Two",    group: "Mortal",    thauma: 35,  health: 55,   ability: 7,   statPoints: 31 },
  { name: "Mortal Three",  group: "Mortal",    thauma: 46,  health: 66,   ability: 9,   statPoints: 41 },
  { name: "Mortal Four",   group: "Mortal",    thauma: 59,  health: 79,   ability: 11,  statPoints: 53 },
  { name: "Mortal Five",   group: "Mortal",    thauma: 75,  health: 95,   ability: 14,  statPoints: 67 },
  { name: "Storied One",   group: "Storied",   thauma: 93,  health: 173,  ability: 17,  statPoints: 83 },
  { name: "Storied Two",   group: "Storied",   thauma: 113, health: 193,  ability: 21,  statPoints: 101 },
  { name: "Storied Three", group: "Storied",   thauma: 136, health: 216,  ability: 25,  statPoints: 122 },
  { name: "Storied Four",  group: "Storied",   thauma: 163, health: 243,  ability: 30,  statPoints: 146 },
  { name: "Storied Five",  group: "Storied",   thauma: 194, health: 274,  ability: 35,  statPoints: 174 },
  { name: "Honored One",   group: "Honored",   thauma: 229, health: 399,  ability: 42,  statPoints: 206 },
  { name: "Honored Two",   group: "Honored",   thauma: 270, health: 440,  ability: 49,  statPoints: 243 },
  { name: "Honored Three", group: "Honored",   thauma: 318, health: 488,  ability: 58,  statPoints: 286 },
  { name: "Honored Four",  group: "Honored",   thauma: 373, health: 543,  ability: 68,  statPoints: 335 },
  { name: "Honored Five",  group: "Honored",   thauma: 435, health: 605,  ability: 79,  statPoints: 391 },
  { name: "Legendary",     group: "Legendary", thauma: 514, health: 884,  ability: 93,  statPoints: 462 },
  { name: "Kaleidian",     group: "Kaleidian", thauma: 615, health: 1085, ability: 111, statPoints: 553 },
];

export const DEFAULT_CHAR = (): CharacterState => ({
  name: "New Student",
  tierLevel: "Mortal",
  hm: 5,
  sn: 5,
  wl: 5,
  flatHealthBonus: 0,
  currentThauma: null,
  currentHealth: null,
  thaumagen: {
    hm: { sub: 5, data: 0, sync: 0 },
    sn: { sub: 5, data: 0, sync: 0 },
    wl: { sub: 5, data: 0, sync: 0 },
  },
  matrices: [],
  merits: [],
  mantles: [],
  items: [],
  summons: [],
});
