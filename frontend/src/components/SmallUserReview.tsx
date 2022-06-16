import { Col, Row } from 'antd'
import { Link } from 'react-router-dom';

import { GameProps } from './Game'


export interface SmallUserReviewProps {
  header:string,
  rating:number,
  description:string,
  game:GameProps
}

export function SmallUserReview({header, rating, description, game}: SmallUserReviewProps) {
  return (
    <>
    <Row>
      <Col span={2}/>
      <Col span={3}>
        <h4 style={{textAlign:'center'}}>{game.name}</h4>
      </Col>
      <Col span={18}/>
    </Row>
    <Row>
      <Col span={2}/>
      <Col span={3}>
        <Link to={`/game/${game.id}`}>
          <img style={{objectFit: "cover" , width: "100%", maxHeight: "100%"}} src={game.pictures[0].source} alt={game.pictures[0].alt} />
        </Link>
      </Col>
      <Col span={1}/>
      <Col span={12}>
        <h1>{header}</h1>
        <p>{description}</p>
      </Col>
      <Col span={3} style={{lineHeight:"100%"}}><h1 style={{textAlign:"center"}}>{rating} %</h1></Col>
      <Col span={2}/>
    </Row>
    </>
  );
};

export default SmallUserReview;