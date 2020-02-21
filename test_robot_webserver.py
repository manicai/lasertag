import pytest

import robot_webserver as web


class FakeRobot:
    def __init__(self):
        self.fired_shot = False
        self.last_move_left = None
        self.last_move_right = None
        self.has_been_hit = False

    def shoot(self):
        self.fired_shot = True

    def move(self, left: float, right: float):
        self.last_move_left = left
        self.last_move_right = right

    def is_hit(self):
        return self.has_been_hit


@pytest.fixture()
def robot():
    return FakeRobot()


async def test_reset(aiohttp_client, loop):
    client = await aiohttp_client(web.build_application(None))
    resp = await client.post('/reset')
    assert resp.status == 200


def test_websocket_shoot(robot: FakeRobot):
    web.parse_websocket('shoot', robot)
    assert robot.fired_shot


def test_websocket_move(robot: FakeRobot):
    web.parse_websocket('move 0.5 -0.75', robot)
    assert robot.last_move_left == 0.5
    assert robot.last_move_right == -0.75
