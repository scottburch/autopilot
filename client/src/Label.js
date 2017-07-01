const Col = require('react-bootstrap/lib/Col');

module.exports = ({children}) => (
    <Col xs={4}><label>{children}:</label></Col>
);