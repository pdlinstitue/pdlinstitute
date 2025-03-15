import React from 'react';

interface ColumnProps {
  columnFilter: string;
  setColumnFilter: (value: string) => void;
}

const ColumnFilter: React.FC<{ column: ColumnProps }> = ({ column }) => {

  const { columnFilter, setColumnFilter } = column;

  return (
    <div>
      <span>
        <input value={columnFilter || ""} onKeyUp={(e:any)=>setColumnFilter(e.target.value)}/>
      </span>
    </div>
  )
}

export default ColumnFilter;
