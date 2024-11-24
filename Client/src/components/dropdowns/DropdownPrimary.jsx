import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import PropTypes from "prop-types";

function DropdownPrimary({ listOfValues, selected, onSelect }) {
  return (
    <DropdownButton id="dropdown-basic-button" title={selected} onClick={(e) => e.stopPropagation()}>
      {listOfValues && listOfValues.length > 0 ? (
        listOfValues.map(({ name, value }) => (
          <Dropdown.Item
            as="button"
            key={value}
            value={value}
            onClick={onSelect}
          >
            {name}
          </Dropdown.Item>
        ))
      ) : (
        <Dropdown.Item disabled>No options available</Dropdown.Item>
      )}
    </DropdownButton>
  );
}

DropdownPrimary.propTypes = {
  selected: PropTypes.string,
};

export default DropdownPrimary;