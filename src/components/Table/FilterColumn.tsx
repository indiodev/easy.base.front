import { Column } from "@tanstack/react-table"
import { Datepicker, Select, TextInput } from "flowbite-react"
import { useMemo } from "react"

export function FilterColumn({ column }: { column: Column<any, unknown> }) {
    const { filterVariant } = column.columnDef.meta as any ?? {}

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () =>
            filterVariant === 'range'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys())
                    .sort()
                    .slice(0, 5000),
        [column.getFacetedUniqueValues(), filterVariant]
    )

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                {/* See faceted column filters example for min max values functionality */}
                <TextInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min`}
                    className="w-24 shadow rounded"
                />
                <TextInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max`}
                    className="w-24 shadow rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <Select
            onChange={e => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString() || ""}
        >
            <option value="">Tudo</option>
            {sortedUniqueValues.map(value => (
                <option value={value} key={value}>
                    {value}
                </option>
            ))}
        </Select>
    ) : filterVariant === 'date' ? (
        <Datepicker
            language="pt-BR" labelTodayButton="Hoje" labelClearButton="Limpar"
            onChange={date => column.setFilterValue(date.target.value)}
            onSelectedDateChanged={date => column.setFilterValue(date ? date.toString() : null)}
        >
        </Datepicker>
    ) : (
        <TextInput
            className="w-full "
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={`Pesquisar ${column.columnDef.header}`}
            type="text"
            value={columnFilterValue?.toString() || ""}
        />

    )
}