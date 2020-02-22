import aiohttp
import aiohttp.web as web
import uuid

routes = web.RouteTableDef()


def get_mac_address() -> str:
    """Return the MAC address of the computer"""
    return hex(uuid.getnode())[2:].upper()


class Score:
    def __init__(self):
        self.have_hit = 0
        self.been_hit = 0

    def reset(self):
        self.have_hit = 0
        self.been_hit = 0


class WebError(Exception):
    pass


def parse_websocket(msg: str, robot):
    if msg.startswith('shoot'):
        robot.shoot()
    elif msg.startswith('move '):
        parts = msg.split()
        (_, left, right) = parts[:3]
        robot.move(float(left), float(right))
    else:
        raise WebError('Unknown message command')


@routes.get('/control')
async def control(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    robot = request.app['robot']
    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            try:
                parse_websocket(msg.data, robot)
            except Exception as exc:
                print("Websocket error: ", exc)
        elif msg.type == aiohttp.WSMsgType.ERROR:
            print('Websocket error: ', ws.exception())

    return ws


@routes.post('/opponent')
async def opponent(request):
    my_id = request.app['sys_id']
    data = {'id': my_id, 'times_hit': 0}
    return web.json_response(data)


@routes.post('/reset')
async def reset_handler(request):
    request.app['score'].reset()
    return web.json_response({})


def build_application(robot):
    app = web.Application()
    app['sys_id'] = get_mac_address()
    app['robot'] = robot
    app['score'] = Score()
    app.add_routes(routes)
    app.add_routes([web.static('/build', 'build'),
                    web.static('/', '.')])
    return app


def run(robot=None):
    app = build_application(robot)
    web.run_app(app)


if __name__ == '__main__':
    run(None)
