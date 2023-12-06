import { type CSSProperties, type ReactNode, type SVGProps } from 'react'

export type ReactChildren = JSX.Element | ReactNode | ReactNode[]

export type IconProps = Omit<SVGProps<SVGElement>, 'ref'> & {
    size?: number
}

export type DirectionalIconProps = IconProps & {
    direction?: 'up'
        | 'down'
        | 'left'
        | 'right'
        | 'upRight'
        | 'upLeft'
        | 'downRight'
        | 'downLeft'
}

export type SplashImage = {
    index: number
    width: string,
    style?: CSSProperties,
    rotation?: number,
    flip?: boolean,
    zIndex?: number
}

// TABLES

export type SortableHeader = {
    label: string,
    tooltip?: string,
    unsortable?: boolean
}

export type Sorting = {
    key: string,
    dir: 'asc' | 'desc'
}

export type TableHeaderProps = {
    headers: SortableHeader[],
    sorting: Sorting,
    onSort: (label: string) => void
}
