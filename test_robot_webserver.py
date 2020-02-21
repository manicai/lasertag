import pytest

import robot_webserver as web


async def test_reset(aiohttp_client, loop):
    client = await aiohttp_client(web.build_application(None))
    resp = await client.post('/reset')
    assert resp.status == 200
