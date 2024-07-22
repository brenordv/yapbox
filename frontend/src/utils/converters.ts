export const currentAgentTypeToName = (): string => {
    const agentType = process.env.REACT_APP_AGENT_TYPE;
    switch (agentType) {
        case 'data-analyst':
            return 'Data Analyst';
        case 'astarion':
            return 'Astarion';
        case 'aylin':
            return 'Aylin';
        case 'gale':
            return 'Gale';
        case 'halsin':
            return 'Halsin';
        case 'isobel':
            return 'Isobel';
        case 'jaheira':
            return 'Jaheira';
        case 'karlac':
            return 'Karlac';
        case 'laezel':
            return 'Lae`zel';
        case 'minsc':
            return 'Minsc';
        case 'minthara':
            return 'Minthara';
        case 'shadowheart':
            return 'Shadowheart';
        case 'wyll':
            return 'Wyll';
        case 'cait':
            return 'Cait';
        case 'cogsworth':
            return 'Cogsworth';
        case 'curie':
            return 'Curie';
        case 'mama-murphy':
            return 'Mama Murphy';
        case 'nick-valentine':
            return 'Nick Valentine';
        case 'paladin-danse':
            return 'Paladin Danse';
        case 'preston-garvey':
            return 'Preston Garvey';
        case 'serana':
            return 'Serana';
        default:
            return 'AI';
    }
}

export const currentAgentTypeToAvatar = (forceRandom: boolean): string => {
    const randomAvatars = [
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Random1&flip=true&radius=50",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Random2&flip=true&radius=50"
    ];

    if (forceRandom) {
        return randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    }

    const agentType = process.env.REACT_APP_AGENT_TYPE;
    switch (agentType) {
        case 'data-analyst':
            const daAvatars = [
                "https://api.dicebear.com/9.x/adventurer/svg?seed=Abby&flip=true&radius=50",
                "https://api.dicebear.com/9.x/adventurer/svg?seed=Bubba&flip=true&radius=50"
            ];
            return daAvatars[Math.floor(Math.random() * daAvatars.length)];
        case 'astarion':
            return 'https://api.dicebear.com/9.x/adventurer/svg?skinColor=f2d3b1&mouth=variant09&hair=long17&hairColor=afafaf&flip=true&radius=50';
        case 'aylin':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Olivia&hair=longCurly&eyes=variant08&glasses=round&flip=true&radius=50';
        case 'gale':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander&hair=shortCombover&eyes=variant07&flip=true&radius=50';
        case 'halsin':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Bear&hair=shortMessy&eyes=variant06&flip=true&radius=50';
        case 'isobel':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Isobel&hair=straight&eyes=variant02&flip=true&radius=50';
        case 'jaheira':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jaheira&hair=longStraight&eyes=variant01&flip=true&radius=50';
        case 'karlac':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Karlac&hair=longFringe&eyes=variant05&flip=true&radius=50';
        case 'laezel':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Laezel&hair=short&eyes=variant04&flip=true&radius=50';
        case 'minsc':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Minsc&hair=shaved&eyes=variant09&flip=true&radius=50';
        case 'minthara':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Minthara&hair=longFringe&eyes=variant03&flip=true&radius=50';
        case 'shadowheart':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Shadowheart&hair=shortMessy&eyes=variant02&flip=true&radius=50';
        case 'wyll':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Wyll&hair=shortCombover&eyes=variant06&flip=true&radius=50';
        case 'cait':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Cait&hair=shortMessy&eyes=variant04&flip=true&radius=50';
        case 'cogsworth':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Cogsworth&hair=none&eyes=variant07&flip=true&radius=50';
        case 'curie':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Curie&hair=longStraight&eyes=variant03&flip=true&radius=50';
        case 'mama-murphy':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=MamaMurphy&hair=longCurly&eyes=variant01&flip=true&radius=50';
        case 'nick-valentine':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=NickValentine&hair=shortCombover&eyes=variant09&flip=true&radius=50';
        case 'paladin-danse':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=PaladinDanse&hair=shortMessy&eyes=variant02&flip=true&radius=50';
        case 'preston-garvey':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=PrestonGarvey&hair=shortCombover&eyes=variant05&flip=true&radius=50';
        case 'serana':
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=Serana&hair=longCurly&eyes=variant08&flip=true&radius=50';
        default:
            return randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    }
}
