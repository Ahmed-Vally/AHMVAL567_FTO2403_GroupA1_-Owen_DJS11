import React from 'react';

function SortDropdown({ sortOption, setSortOption }) {
  const handleChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div style={styles.dropdownContainer}>
      <label htmlFor="sortDropdown" style={styles.label}>Sort By:</label>
      <select
        id="sortDropdown"
        value={sortOption}
        onChange={handleChange}
        style={styles.dropdown}
      >
        <option value="none">None</option>
        <option value="asc">Alphabetically A-Z</option>
        <option value="desc">Alphabetically Z-A</option>
      </select>
    </div>
  );
}

const styles = {
  dropdownContainer: {
    marginBottom: '20px',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginRight: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  dropdown: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
};

export default SortDropdown;
