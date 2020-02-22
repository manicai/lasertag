import unittest.mock as mock
import robot_webserver as web


async def test_reset(aiohttp_client, loop):
    client = await aiohttp_client(web.build_application(None))
    resp = await client.post('/reset')
    assert resp.status == 200


def test_websocket_shoot():
    robot = mock.Mock()
    web.parse_websocket('shoot', robot)
    robot.shoot.assert_called_once()


def test_websocket_move():
    robot = mock.Mock()
    web.parse_websocket('move 0.5 -0.75', robot)
    robot.move.assert_called_with(0.5, -0.75)
