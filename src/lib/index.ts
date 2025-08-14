// place files you want to import through the `$lib` alias in this folder.
export interface StickyData {
    
}

export interface ActiveSticky {
    data: StickyData
    position: { x: number, y: number }
}