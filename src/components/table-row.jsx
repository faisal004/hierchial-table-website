import PropTypes from 'prop-types';
import { useState } from 'react';

const TableRow = ({ row, level = 1, onUpdateValue, originalValues }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const hasChildren = row.children && row.children.length > 0;
    const originalValue = originalValues[row.id] || row.value;
    const variance = ((row.value - originalValue) / originalValue * 100).toFixed(2);

    const validateAndHandleInput = (value) => {
        setInputValue(value);
        setError('');
    };

    const handleAllocationPercentage = () => {
        if (!inputValue) return;
        const percentage = parseFloat(inputValue);
        if (isNaN(percentage)) {
            setError('Please enter a valid number');
            return;
        }

        const increase = row.value * (percentage / 100);
        const newValue = row.value + increase;

        if (newValue <= 0) {
            setError('Resulting value cannot be zero or negative');
            return;
        }

        onUpdateValue(row.id, newValue, hasChildren);
        setInputValue('');
        setError('');
    };

    const handleAllocationValue = () => {
        if (!inputValue) return;
        const newValue = parseFloat(inputValue);
        
        if (isNaN(newValue)) {
            setError('Please enter a valid number');
            return;
        }

        if (newValue <= 0) {
            setError('Value cannot be zero or negative');
            return;
        }

        onUpdateValue(row.id, newValue, hasChildren);
        setInputValue('');
        setError('');
    };

    return (
        <>
            <tr className="border-b">
                <td className="p-2 border-r" style={{ paddingLeft: `${level * 2}rem` }}>
                    {row.label}
                </td>
                <td className="p-2 text-right border-r">
                    {row.value.toFixed(2)}
                </td>
                <td className="p-2 pl-10 w-96 border-r">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => validateAndHandleInput(e.target.value)}
                                className={`w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    error ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter value"
                            />
                            <button 
                                onClick={handleAllocationPercentage}
                                className="inline-flex h-8 text-sm items-center justify-center rounded-md bg-neutral-950 px-4 font-medium text-neutral-50 shadow-lg shadow-neutral-500/20 transition active:scale-95"
                            >
                                Alloc %
                            </button>
                            <button 
                                onClick={handleAllocationValue}
                                className="inline-flex h-8 text-sm items-center justify-center rounded-md bg-neutral-950 px-4 font-medium text-neutral-50 shadow-lg shadow-neutral-500/20 transition active:scale-95"
                            >
                                Alloc Value
                            </button>
                        </div>
                        {error && (
                            <span className="text-red-500 text-sm">{error}</span>
                        )}
                    </div>
                </td>
                <td className='flex items-center justify-center'>
                    {variance !== '0.00' ? (
                        <span className={`m-2 ${parseFloat(variance) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {variance}%
                        </span>
                    ) : (
                        <span className="m-2">
                            0%
                        </span>
                    )}
                </td>
            </tr>
            {hasChildren && row.children.map(child => (
                <TableRow
                    key={child.id}
                    row={child}
                    level={level + 1}
                    onUpdateValue={onUpdateValue}
                    originalValues={originalValues}
                />
            ))}
        </>
    );
};

TableRow.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        children: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    level: PropTypes.number,
    onUpdateValue: PropTypes.func.isRequired,
    originalValues: PropTypes.object.isRequired
};

export default TableRow;