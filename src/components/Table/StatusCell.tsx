import { Dropdown, Select } from "flowbite-react";
import { STATUSES } from "@/utils/data";
import { ChangeEventHandler, useState } from "react";
import { slugify } from "@/contexts/functions";

export const ColorIcon = ({ color, ...props }: any) => (
  <div w="12px" h="12px" bg={color} {...props} > </div>
);

const StatusCell = ({ getValue, row, column, table }: any) => {
  const { updateData, selectOptions } = table.options.meta;

  const [value, setValue] = useState(getValue())

  const options = selectOptions.filter((col: any) => col.title.toLowerCase() == column.id)[0].config?.options?.map((opt: any) => ({
    name: opt.name,
    id: opt.name,
    color: opt.color || "blue"
  }))

  //console.log(selectOptions, value)

  const updateValue = (val: any) => {
    table.options.meta?.updateData(row.index, column.id, val);
    console.log(val)
  };

  // console.log(value)

  return (
    <Select value={getValue()} onChange={val => updateValue(val.target.value)}>

      {options?.map((status: any, index: number) => (
        <option
          key={index}
          value={status.name}
        >
          {status?.name}
        </option>
      ))}
    </Select>


  );
};
export default StatusCell;
