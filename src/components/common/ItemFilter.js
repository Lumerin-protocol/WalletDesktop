import { useState } from 'react';

export const ItemFilter = ({
  defaultFilter = '',
  extractValue = _ => _,
  children,
  items
}) => {
  const [activeFilter, setActiveFilter] = useState(defaultFilter);

  const handleFilter = (filterValue, items) =>
    filterValue
      ? items.filter(item => this.props.extractValue(item) === filterValue)
      : items;

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
