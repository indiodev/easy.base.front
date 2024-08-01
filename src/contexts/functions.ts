import DateCell from "@/components/Table/DateCell"
import EditableCell from "@/components/Table/EditableCell"
import StatusCell from "@/components/Table/StatusCell"

export function getDataType(type: string) {
    if (type == 'selectcell') return StatusCell
    if (type == 'datecell') return DateCell
    if (type == 'editablecell') return EditableCell
}

export function getFilterVariant(type: string) {
    if (type == 'selectcell') return 'select'
    if (type == 'datecell') return 'date'
    if (type == 'editablecell') return 'text'
    return null
}

export function slugify(str: string, separator: string = "_") {
    return str
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, separator);
};