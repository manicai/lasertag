import aiohttp
import aiohttp.web as web

routes = web.RouteTableDef()


@routes.get('/control')
async def control(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            if msg.data.startswith('shoot'):
                pass
            elif msg.data.startswith('move'):
                pass
            else:
                # Unknown message.
                pass
        elif msg.type == aiohttp.WSMsgType.ERROR:
            print('Websocket error: ', ws.exception())

    return ws


@routes.post('/opponent')
async def opponent(request):
    data = {'id': 'my_id', 'times_hit': 0}
    return web.json_response(data)


@routes.post('/reset')
async def reset_handler(request):
    return web.json_response({})


def build_application(robot):
    app = web.Application()
    app['robot'] = robot
    app.add_routes(routes)
    app.add_routes([web.static('/build', 'build'),
                    web.static('/', '.')])
    return app


def run(robot=None):
    app = build_application(robot)
    web.run_app(app)


if __name__ == '__main__':
    run(None)
