import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PropTypes from 'prop-types';

function DropdownPrimary({ title }) {
  return (
    <DropdownButton id="dropdown-basic-button" title={title}>
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>
  );
}

DropdownPrimary.propTypes = {
  title: PropTypes.string.isRequired,
};

export default DropdownPrimary;