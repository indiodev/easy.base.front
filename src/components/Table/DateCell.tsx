import { ForwardedRef, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "@/components/Icons/CalendarIcon";
import { ptBR } from "date-fns/locale";
registerLocale('ptBr', ptBR)
setDefaultLocale('br')




export const DateCustomInput = forwardRef(({ value, onClick, clearDate }: any, ref: any) => {

  return (<div className="relative w-full min-h-3 min-w-5 h-full cursor-pointer" ref={ref} onClick={onClick} >
    {value ? (
      <div className="flex flex-row gap-2 items-center">
        {value}
        <div
          className="text-base text-red-300"
          onClick={(e) => {
            e.stopPropagation();
            clearDate();
          }}
        >
          &times;
        </div>
      </div>
    ) : (
      <CalendarIcon />
    )}
  </div>
  )
});

export const DateCell = ({ getValue, row, column, table }: any) => {
  const date = getValue();

  const { updateData } = table.options.meta;
  return (
    <DatePicker
      wrapperClassName="date-wrapper"
      dateFormat="dd MMM YYYY"
      locale="ptBr"
      selected={date}
      onChange={(date) => updateData(row.index, column.id, date)}
      customInput={
        <DateCustomInput
          clearDate={() => updateData(row.index, column.id, null)}
        />
      }
    />
  );
};
export default DateCell;
