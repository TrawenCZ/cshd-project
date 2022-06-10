import useSWR from 'swr';
import fetcher from '../models/fetcher';

import { Col, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import { useParams } from 'react-router-dom';

import { GameProps } from './Game'


export interface SmallUserReviewProps {
  id:string,
  header:string,
  rating:number,
  description:string,
  game:GameProps
}

export function SmallUserReview({id, header, rating, description, game}: SmallUserReviewProps) {
  return (
     <Row>
      <Col span={1}/>
      <Col span={3}>
        <p>{game.name}</p>
        <img src={game.pictures[0].source} alt={game.pictures[0].alt} />
      </Col>
      <Col span={16}>
        <p>{header}</p>
        <p>{description}</p>
      </Col>
      <Col span={3}><h2>{rating} %</h2></Col>
      <Col span={1}/>
    </Row>
  );
};

export default SmallUserReview;