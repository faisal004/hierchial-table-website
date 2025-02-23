import { useEffect, useState } from "react";
import TableRow from "./table-row";
import { initialData } from "../data/table-data";

const MainTable = () => {
    const [tableData, setTableData] = useState(initialData);
    const [originalValues, setOriginalValues] = useState({});
  
    useEffect(() => {
      const values = {};
      const storeOriginalValues = (rows) => {
        rows.forEach(row => {
          values[row.id] = row.value;
          if (row.children) {
            storeOriginalValues(row.children);
          }
        });
      };
      storeOriginalValues(initialData.rows);
      setOriginalValues(values);
    }, []);
  
    const calculateTotal = (rows) => {
      return rows.reduce((sum, row) => {
        if (row.children) {
          row.value = calculateTotal(row.children);
        }
        return sum + row.value;
      }, 0);
    };
  
    const distributeToChildren = (row, newValue) => {
      const ratio = newValue / row.value;
      row.children.forEach(child => {
        child.value *= ratio;
        if (child.children) {
          distributeToChildren(child, child.value);
        }
      });
      row.value = newValue;
    };
  
    const updateValue = (id, newValue, hasChildren) => {
      const updateRow = (rows) => {
        return rows.map(row => {
          if (row.id === id) {
            if (hasChildren) {
              distributeToChildren(row, newValue);
              return row;
            }
            return { ...row, value: newValue };
          }
          if (row.children) {
            return { ...row, children: updateRow(row.children) };
          }
          return row;
        });
      };
  
      setTableData(prev => {
        const newData = { rows: updateRow(prev.rows) };
        calculateTotal(newData.rows);
        return newData;
      });
    };
  
    const grandTotal = calculateTotal(tableData.rows);
  
    return (
      <div className="w-full max-w-4xl mx-auto pt-5  ">
        <div className="p-2 shadow-xl ">
          <div className="overflow-x-auto ">
            <table className="w-full  ">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Label</th>
                  <th className="p-2 text-right">Value</th>
                  <th className="p-2">Actions</th>
                  <th className="p-2">Variance% </th>
                </tr>
              </thead>
              <tbody >
                {tableData.rows.map(row => (
                  <TableRow
                    key={row.id}
                    row={row}
                    onUpdateValue={updateValue}
                    originalValues={originalValues}
                  />
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="p-2">Grand Total</td>
                  <td className="p-2 text-right">{grandTotal.toFixed(2)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  export default MainTable;