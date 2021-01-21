from ..api.envirocar import get_envirocar_user


async def handler(x_user, x_token):
    data = await get_envirocar_user(x_user, x_token)
    return {'valid': False if not 'name' in data and not 'email' in data else True}
