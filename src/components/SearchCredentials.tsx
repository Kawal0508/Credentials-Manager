import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Search, X } from 'lucide-react';

interface SearchCredentialsProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchCredentials: React.FC<SearchCredentialsProps> = ({ 
  onSearch, 
  placeholder = "Search credentials..." 
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-credentials">
      <InputGroup>
        <InputGroup.Text>
          <Search size={18} />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
        />
        {query && (
          <Button
            variant="outline-secondary"
            onClick={clearSearch}
            className="d-flex align-items-center"
          >
            <X size={16} />
          </Button>
        )}
      </InputGroup>
    </div>
  );
};

export default SearchCredentials;
