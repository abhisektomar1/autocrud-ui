// Define types for the generator
interface CreativeNameGenerator {
    colors: string[];
    animals: string[];
    objects: string[];
    elements: string[];
    characteristics: string[];
    nature: string[];
    cosmic: string[];
    materials: string[];
    weather: string[];
    time: string[];
    seasons: string[];
    emotions: string[];
    mystical: string[];
    directions: string[];
    energy: string[];
    generateName: () => string;
    getRandomFrom: (category: CategoryKey) => string;
    generateNames: (count?: number) => string[];
}

// Type for valid category keys
type CategoryKey = keyof Omit<CreativeNameGenerator, 'generateName' | 'getRandomFrom' | 'generateNames'>;

const creativeNameGenerator: CreativeNameGenerator = {
    colors: [
        "Crimson", "Azure", "Emerald", "Golden", "Silver", "Violet", "Amber", "Coral", "Jade", "Cobalt",
        "Scarlet", "Cerulean", "Turquoise", "Indigo", "Burgundy", "Ivory", "Sapphire", "Ruby", "Topaz", "Obsidian",
        "Chartreuse", "Magenta", "Maroon", "Teal", "Ochre", "Periwinkle", "Fuchsia", "Mauve", "Sienna", "Vermillion"
    ],
    
    animals: [
        "Wolf", "Raven", "Phoenix", "Dragon", "Tiger", "Falcon", "Serpent", "Lion", "Eagle", "Panther",
        "Griffin", "Unicorn", "Pegasus", "Hydra", "Chimera", "Manticore", "Sphinx", "Basilisk", "Kraken", "Leviathan",
        "Wyrm", "Behemoth", "Thunderbird", "Kitsune", "Wyvern", "Fenris", "Dragonfly", "Scorpion", "Lynx", "Jackal"
    ],
    
    objects: [
        "Crystal", "Blade", "Shadow", "Star", "Storm", "Crown", "Shield", "Flame", "Arrow", "Stone",
        "Scepter", "Chalice", "Orb", "Mirror", "Tome", "Pendant", "Ring", "Staff", "Scroll", "Pyramid",
        "Prism", "Cube", "Sphere", "Compass", "Hourglass", "Lantern", "Portal", "Gate", "Bridge", "Tower"
    ],
    
    elements: [
        "Fire", "Frost", "Thunder", "Wind", "Earth", "Ocean", "Mountain", "Sky", "Moon", "Sun",
        "Lightning", "Ice", "Magma", "Storm", "Void", "Aether", "Plasma", "Crystal", "Metal", "Wood",
        "Shadow", "Light", "Time", "Space", "Gravity", "Steam", "Mist", "Ash", "Dust", "Smoke"
    ],
    
    characteristics: [
        "Swift", "Mystic", "Ancient", "Brave", "Silent", "Fierce", "Wise", "Noble", "Wild", "Eternal",
        "Radiant", "Stoic", "Valiant", "Enigmatic", "Luminous", "Tenacious", "Resolute", "Ethereal", "Majestic", "Serene",
        "Astral", "Sublime", "Infinite", "Profound", "Seamless", "Vibrant", "Dynamic", "Pristine", "Arcane", "Mythical"
    ],
    
    nature: [
        "Forest", "River", "Mountain", "Valley", "Cloud", "Dawn", "Dusk", "Peak", "Storm", "Grove",
        "Canyon", "Glacier", "Meadow", "Desert", "Oasis", "Tundra", "Volcano", "Rapids", "Prairie", "Reef",
        "Cavern", "Basin", "Delta", "Fjord", "Heath", "Island", "Jungle", "Lagoon", "Mesa", "Woodland"
    ],
    
    cosmic: [
        "Nova", "Nebula", "Comet", "Galaxy", "Aurora", "Celestial", "Stellar", "Astral", "Lunar", "Solar",
        "Pulsar", "Quasar", "Cosmos", "Zodiac", "Eclipse", "Starlight", "Orbit", "Meteor", "Solstice", "Equinox",
        "Parallax", "Vortex", "Horizon", "Zenith", "Nadir", "Asteroid", "Supernova", "Neutron", "Cosmic", "Planetary"
    ],
    
    materials: [
        "Iron", "Steel", "Bronze", "Obsidian", "Diamond", "Platinum", "Onyx", "Marble", "Glass", "Pearl",
        "Mithril", "Adamant", "Orichalcum", "Titanium", "Crystal", "Moonstone", "Stardust", "Ethereal", "Celestial", "Prismatic",
        "Mercury", "Quicksilver", "Bismuth", "Tungsten", "Carbon", "Beryl", "Aether", "Void", "Quantum", "Plasma"
    ],

    weather: [
        "Thunder", "Lightning", "Rain", "Mist", "Fog", "Breeze", "Tempest", "Tornado", "Blizzard", "Hurricane",
        "Cyclone", "Monsoon", "Typhoon", "Gale", "Whirlwind", "Sandstorm", "Zephyr", "Squall", "Downpour", "Deluge",
        "Cloudburst", "Windstorm", "Snowstorm", "Thunderbolt", "Avalanche", "Drought", "Flood", "Hail", "Storm", "Tempest"
    ],

    time: [
        "Dawn", "Dusk", "Twilight", "Midnight", "Eternal", "Ancient", "Forever", "Timeless", "Morning", "Evening",
        "Daybreak", "Nightfall", "Yesterday", "Tomorrow", "Moment", "Infinity", "Epoch", "Era", "Age", "Cycle",
        "Season", "Century", "Millennium", "Instant", "Duration", "Period", "Phase", "Eternity", "Perpetual", "Endless"
    ],

    seasons: [
        "Winter", "Summer", "Spring", "Autumn", "Solstice", "Equinox", "Harvest", "Frost", "Bloom", "Fall",
        "Monsoon", "Drought", "Thaw", "Growth", "Decay", "Hibernation", "Migration", "Renewal", "Change", "Cycle",
        "Verdant", "Dormant", "Abundant", "Barren", "Fertile", "Fallow", "Waxing", "Waning", "Rising", "Setting"
    ],

    emotions: [
        "Joy", "Fury", "Serenity", "Valor", "Peace", "Rage", "Hope", "Dream", "Wonder", "Calm",
        "Passion", "Bliss", "Harmony", "Courage", "Honor", "Pride", "Glory", "Grace", "Spirit", "Soul",
        "Triumph", "Victory", "Destiny", "Fortune", "Wisdom", "Power", "Unity", "Liberty", "Justice", "Truth"
    ],

    mystical: [
        "Arcane", "Mystic", "Ethereal", "Divine", "Sacred", "Spiritual", "Mythic", "Legend", "Fable", "Lore",
        "Oracle", "Prophecy", "Vision", "Omen", "Rune", "Sigil", "Talisman", "Grimoire", "Artifact", "Relic",
        "Enchanted", "Blessed", "Hallowed", "Occult", "Mystical", "Magical", "Supernatural", "Celestial", "Mythical", "Ancient"
    ],

    directions: [
        "North", "South", "East", "West", "Zenith", "Rising", "Setting", "Ascending", "Beyond", "Within",
        "Above", "Below", "Forward", "Backward", "Inward", "Outward", "Upward", "Downward", "Central", "Peripheral",
        "Cardinal", "Ordinal", "Vertical", "Horizontal", "Diagonal", "Spiral", "Curved", "Linear", "Circular", "Parallel"
    ],

    energy: [
        "Pulse", "Wave", "Spark", "Beam", "Surge", "Force", "Power", "Spirit", "Soul", "Heart",
        "Aura", "Flux", "Flow", "Current", "Charge", "Field", "Resonance", "Frequency", "Vibration", "Radiation",
        "Essence", "Core", "Node", "Nexus", "Vortex", "Channel", "Stream", "Matrix", "Grid", "Network"
    ],

    generateName(): string {
        const patterns: Array<() => string> = [
            () => `${this.getRandomFrom('characteristics')} ${this.getRandomFrom('animals')}`,
            () => `${this.getRandomFrom('colors')} ${this.getRandomFrom('objects')}`,
            () => `${this.getRandomFrom('elements')} ${this.getRandomFrom('mystical')}`,
            () => `${this.getRandomFrom('cosmic')} ${this.getRandomFrom('nature')}`,
            () => `${this.getRandomFrom('materials')} ${this.getRandomFrom('weather')}`,
            () => `${this.getRandomFrom('time')} ${this.getRandomFrom('energy')}`,
            () => `${this.getRandomFrom('seasons')} ${this.getRandomFrom('directions')}`,
            () => `${this.getRandomFrom('emotions')} ${this.getRandomFrom('animals')}`,
            () => `${this.getRandomFrom('characteristics')} ${this.getRandomFrom('cosmic')} ${this.getRandomFrom('objects')}`,
            () => `${this.getRandomFrom('colors')} ${this.getRandomFrom('animals')} of the ${this.getRandomFrom('elements')}`
        ];

        return patterns[Math.floor(Math.random() * patterns.length)]();
    },

    getRandomFrom(category: CategoryKey): string {
        return this[category][Math.floor(Math.random() * this[category].length)];
    },

    generateNames(count: number = 5): string[] {
        return Array.from({ length: count }, () => this.generateName());
    }
};

export default creativeNameGenerator;