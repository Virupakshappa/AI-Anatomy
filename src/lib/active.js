import { createContext } from 'react'

// Lets each Section report itself as the active layer for the DepthGauge.
export const ActiveContext = createContext({ setActive: () => {} })
