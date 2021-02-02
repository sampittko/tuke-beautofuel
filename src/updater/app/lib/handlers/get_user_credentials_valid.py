from ..api.envirocar import get_envirocar_user


async def handler(x_user, x_token):
    print("Processing enviroCar credentials validation request for user", x_user)
    data = await get_envirocar_user(x_user, x_token)
    valid = False if not 'name' in data and not 'email' in data else True
    return handler_success(valid, x_user)


def handler_success(valid, user):
    message = 'Credentials are valid' if valid else 'Credentials are not valid'
    print(message)
    return {'statusCode': 200, 'valid': valid, 'message': message}
