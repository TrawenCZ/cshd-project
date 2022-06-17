import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { GameProps } from './Game';
import "../styles/small.css";

export function SmallGameCard(game: GameProps) {
    return (
        <>
        <Row style = {{paddingTop:"20px"}}>
            <Col span={3}/>
            <Col span={3}>
                <h4 style={{textAlign:"center"}}>{game.name}</h4>
            </Col>
            <Col span={18}/>
            </Row>
            <Row style = {{paddingBottom:"20px"}}>
            <Col span={3}/>
            <Col span={3}>
                <Link to={`/game/${game.id}`}>
                    <img className="small-game-image" src={game.pictures[0].source} alt={game.pictures[0].alt} />
                </Link>
            </Col>
            <Col span={1}/>
            <Col span={12}>
                <h3>{game.description}</h3>
            </Col>
            <Col span={3}><h1 style={{textAlign:"center", fontSize:"50px"}}>{game.rating} %</h1></Col>
            <Col span={2}/>
        </Row>
        </>
    );
};

export default SmallGameCard;