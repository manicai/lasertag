import robot_webserver as web
import pytest


class MockRobot:
    def __init__(self):
        self.shoot_called = False
        self.move_called_with = None

    async def shoot(self):
        self.shoot_called = True

    async def move(self, left, right):
        self.move_called_with = (left, right)


@pytest.fixture
def robot():
    return MockRobot()


async def test_reset(aiohttp_client):
    client = await aiohttp_client(web.build_application(None))
    resp = await client.post('/reset')
    assert resp.status == 200


async def test_websocket_shoot(robot):
    await web.parse_websocket('shoot', robot)
    assert robot.shoot_called


async def test_websocket_move(robot):
    await web.parse_websocket('motor 0.5 -0.75', robot)
    assert robot.move_called_with == (0.5, -0.75)
