import { useState } from 'react';

export const ItemFilter = ({
  defaultFilter = '',
  extractValue = _ => _,
  children,
  items
}) => {
  const [activeFilter, setActiveFilter] = useState(defaultFilter);

  const handleFilter = (filterValue, itemsList) =>
    filterValue
      ? itemsList.filter(item => extractValue(item) === filterValue)
      : itemsList;

  const onFilterChange = filterValue => {
    if (typeof filterValue !== 'undefined') {
      setActiveFilter(filterValue);
    }
  };

  return children({
    onFilterChange,
    filteredItems: handleFilter(activeFilter, items),
    activeFilter
  });
};
