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
            const {amy} = thememirror
            return amy
        
        default:
            const { amy: defaultTheme } = thememirror
            return defaultTheme
    }
}
