import DateCell from "@/components/Table/DateCell"
import EditableCell from "@/components/Table/EditableCell"
import StatusCell from "@/components/Table/StatusCell"

export type GroupType = {
    id: string
    title: string
    level: string
    users?: UserType[]
}

export enum UserRole {
    ADMIN,
    CREATOR,
    REVISOR,
    COLLABORATOR,
    EDITOR,
    VIEWER,
    USER,
}


export type UserType = {
    id: string
    name: string
    email: string
    password: string
    group?: GroupType
    tables?: TableType[]
    status: string
    created_at: Date
    updated_at?: Date
    deleted_at?: Date
    reviews?: ReviewType[]
    rows?: RowType[]
    role: UserRole
}

export type TableType = {
    id: string
    title: string
    identifier: string
    rows?: RowType[]
    columns: ColumnType[]
    config?: Object
    category?: string
    status?: string
    created_at?: Date
    updated_at?: Date
    deleted_at?: Date
    owner?: UserType
}

export type ColumnType = {
    id: string
    title: string
    identifier: string
    slug: string
    type: string
    data?: Object
    config?: any
    status?: string
    created_at?: Date
    updated_at?: Date
    deleted_at?: Date
    table?: TableType

}

export type RowType = {
    id: string
    value?: Object
    config?: Object
    created_by: UserType
    created_at?: Date
    updated_at?: Date
    deleted_at?: Date
    reviews?: ReviewType[]
    table?: TableType
}

export type ReviewType = {
    id: string
    title: string
    text: string
    status: string
    created_at?: Date
    updated_at?: Date
    deleted_at?: Date
    created_by?: UserType
    row?: RowType
}

export type FormType = {
    id: string
    title: string
    tableId: string
    created_at: Date
    updated_at: Date | null
    deleted_at: Date | null
    userId: string | null
    published: boolean
    description: string
    visits: number
    submissions: number
    shareUrl: string
    user: UserType,
    table: TableType
}

export const DATA_TYPES = {
    DATE: {
        title: 'Data',
        id: 'datecell',
        object: DateCell
    },
    TEXT: {
        title: 'Texto',
        id: 'editablecell',
        object: EditableCell
    },
    SELECT: {
        title: 'Seleção',
        id: 'selectcell',
        object: StatusCell,
    }
}

type SelectCellType = {
    id: Number
    name: string
    color: string
}