/**
 * CodeMirror 6 Modes
 * aka Languages
 * 
 * https://codemirror.net/#languages
 * 
 */
export const selectedTheme = async (selected) => {
    const thememirror = await import('thememirror')
    switch(selected) {
        case 'amy':
            const { amy } = await thememirror
            return await amy
        case 'ayuLight':
            const { ayuLight } = await thememirror
            return await ayuLight
        case 'barf':
            const { barf } = await thememirror
            return await barf
        case 'bespin':
            const { bespin } = await thememirror
            return await bespin
        case 'birdsOfParadise':
            const { birdsOfParadise } = await thememirror
            return await birdsOfParadise
        case 'boysAndGirls':
            const { boysAndGirls } = await thememirror
            return await boysAndGirls
        case 'clouds':
            const { clouds } = await thememirror
            return await clouds
        case 'cobalt':
            const { cobalt } = await thememirror
            return await cobalt
        case 'coolGlow':
            const { coolGlow } = await thememirror
            return await coolGlow
        case 'dracula':
            const { dracula } = await thememirror
            return await dracula
        case 'espresso':
            const { espresso } = await thememirror
            return await espresso
        case 'noctisLilac':
            const { noctisLilac } = await thememirror
            return await noctisLilac
        case 'rosePineDawn':
            const { rosePineDawn } = await thememirror
            return await rosePineDawn
        case 'smoothy':
            const { smoothy } = await thememirror
            return await smoothy
        case 'solarizedLight':
            const { solarizedLight } = await thememirror
            return await solarizedLight
        case 'tomorrow':
            const { tomorrow } = await thememirror
            return await tomorrow
        
        default:
            const { amy: defaultTheme } = thememirror
            return defaultTheme
    }
}
