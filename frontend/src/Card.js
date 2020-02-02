import React from 'react';
import {
  Card, Button, CardImg, CardTitle, CardText, CardGroup,
  CardSubtitle, CardBody
} from 'reactstrap';
const Example = (props) => {
  let items = props.items;
  if (items.length == 1) {
    return (
        <CardGroup>
          <Card>
            <CardImg top width="100%" src={items[0]} alt="Card image cap" />
          </Card>
        </CardGroup>
    );

  } else if (items.length == 2) {
    return (
        <CardGroup>
          <Card>
            <CardImg top width="100%" src={items[0]} alt="Card image cap" />
          </Card>
          <Card>
            <CardImg top width="100%" src={items[1]} alt="Card image cap" />
          </Card>
        </CardGroup>
    );

  } else if (items.length >= 3) {
    return (
      <CardGroup>
        <Card>
          <CardImg top width="100%" src={items[0]} alt="Card image cap" />
        </Card>
        <Card>
          <CardImg top width="100%" src={items[1]} alt="Card image cap" />
        </Card>
        <Card>
          <CardImg top width="100%" src={items[2]} alt="Card image cap" />
        </Card>
      </CardGroup>
    );

  }
};

export default Example;