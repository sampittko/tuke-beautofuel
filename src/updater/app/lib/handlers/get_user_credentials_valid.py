from ..api.envirocar import get_envirocar_user


async def handler(x_user, x_token):
    data = await get_envirocar_user(x_user, x_token)
    valid = False if not 'name' in data and not 'email' in data else True
    print('Credentials of user with name {} validated'.format(x_user))
    return {'valid': valid}
