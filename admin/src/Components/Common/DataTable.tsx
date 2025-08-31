import React from 'react';
import { Eye, Edit, Trash2, Shield } from 'lucide-react';
import './DataTable.scss';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface Action {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: (row: any) => boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  actions?: Action[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  onRowClick?: (row: any) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (rowId: string, selected: boolean) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = 'No data found',
  emptyIcon,
  className = '',
  onRowClick,
  selectable = false,
  selectedRows = [],
  onRowSelect
}) => {
  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleRowSelect = (rowId: string, selected: boolean) => {
    if (onRowSelect) {
      onRowSelect(rowId, selected);
    }
  };

  const renderCell = (column: Column, row: any) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    return value || '-';
  };

  const renderActions = (row: any) => {
    if (actions.length === 0) return null;

    return (
      <div className="data-table__actions">
        {actions.map((action) => {
          const isDisabled = action.disabled ? action.disabled(row) : false;
          
          return (
            <button
              key={action.key}
              className={`data-table__action-btn data-table__action-btn--${action.variant || 'secondary'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  action.onClick(row);
                }
              }}
              disabled={isDisabled}
              title={action.label}
            >
              {action.icon}
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`data-table ${className}`}>
        <div className="data-table__loading">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`data-table ${className}`}>
        <div className="data-table__empty">
          {emptyIcon}
          <h3>No data found</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      <table className="data-table__table">
        <thead className="data-table__header">
          <tr>
            {selectable && (
              <th className="data-table__header-cell data-table__header-cell--checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) => {
                    data.forEach(row => {
                      handleRowSelect(row._id || row.id, e.target.checked);
                    });
                  }}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className="data-table__header-cell"
                style={{
                  width: column.width,
                  textAlign: column.align || 'left'
                }}
              >
                {column.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="data-table__header-cell data-table__header-cell--actions">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="data-table__body">
          {data.map((row, index) => (
            <tr
              key={row._id || row.id || index}
              className={`data-table__row ${onRowClick ? 'data-table__row--clickable' : ''}`}
              onClick={() => handleRowClick(row)}
            >
              {selectable && (
                <td className="data-table__cell data-table__cell--checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row._id || row.id)}
                    onChange={(e) => handleRowSelect(row._id || row.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="data-table__cell"
                  style={{ textAlign: column.align || 'left' }}
                >
                  {renderCell(column, row)}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="data-table__cell data-table__cell--actions">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
