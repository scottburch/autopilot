const Col = require('react-bootstrap/lib/Col');
const Row = require('react-bootstrap/lib/Row');
const Grid = require('react-bootstrap/lib/Grid');
const Well = require('react-bootstrap/lib/Well');

const ValuesBox = require('./ValuesBox');
const ExtraBox = require('./ExtraBox');
const AdjustableValuesBox = require('./AdjustableValuesBox');
const PresetsSelect = require('./PresetsSelect');


module.exports = () => (
    <Grid fluid>
        <Row>
            <Col style={{paddingBottom: 5}}><PresetsSelect /></Col>
        </Row>
        <Row>
            <Col xs={6}>
                <Well>
                    <ValuesBox />
                    <AdjustableValuesBox />
                </Well>
            </Col>
            <Col xs={6}>
                <Well>
                    <ExtraBox />
                </Well>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <Well>
                    LOG
                </Well>
            </Col>
        </Row>
    </Grid>
);