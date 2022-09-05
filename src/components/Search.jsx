import TextField from "@mui/material/TextField";

const Search = ({ setSearchTerm }) => {
  const handleSearch = (e) => {
    let value = e.target.value;
    // value.length > 2 && setSearchTerm(value);
    setSearchTerm(value);
    // console.log(searchTerm);
  };

  return (
    <div className="search">
      <TextField
        id="outlined-search"
        label="Rechercher par nom"
        type="search"
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
